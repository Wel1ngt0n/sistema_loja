from flask import Blueprint, request, jsonify
from app.models.pre_order import PreOrder
from app.models.pre_order_item import PreOrderItem
from app.extensions import db
from app.utils.security import require_auth, require_permission
from app.services.sale_service import SaleService # Import SaleService
import datetime
from flask import g # Import g for user

pre_order_bp = Blueprint('pre_orders', __name__, url_prefix='/api/v1/preorders')

@pre_order_bp.route('', methods=['GET'])
@require_auth
@require_permission('preorders:read')
def list_preorders():
    # Filter by date (pickup), status, search
    pickup_date = request.args.get('date')
    status = request.args.get('status')
    search = request.args.get('search')
    
    query = PreOrder.query
    
    if pickup_date:
        # Assuming date string format YYYY-MM-DD
        try:
            target_date = datetime.datetime.strptime(pickup_date, '%Y-%m-%d').date()
            # Filter where pickup_datetime falls on this date
            query = query.filter(db.func.date(PreOrder.pickup_datetime) == target_date)
        except ValueError:
            pass
            
    if status:
        query = query.filter(PreOrder.status == status)
        
    if search:
        query = query.filter(
            (PreOrder.customer_name.ilike(f'%{search}%')) | 
            (PreOrder.customer_phone.ilike(f'%{search}%'))
        )
        
    orders = query.order_by(PreOrder.pickup_datetime.asc()).all()
    return jsonify([o.to_dict() for o in orders])

@pre_order_bp.route('/<int:id>', methods=['GET'])
@require_auth
@require_permission('preorders:read')
def get_preorder(id):
    order = PreOrder.query.get_or_404(id)
    return jsonify(order.to_dict())

@pre_order_bp.route('', methods=['POST'])
@require_auth
@require_permission('preorders:write')
def create_preorder():
    data = request.get_json()
    
    try:
        # Validate critical fields
        if not data.get('customer_name') or not data.get('customer_phone') or not data.get('pickup_datetime'):
            return jsonify({'message': 'Campos obrigatórios faltando (nome, telefone ou data)'}), 400
            
        pickup_dt = datetime.datetime.fromisoformat(data['pickup_datetime'].replace('Z', '+00:00'))
        
        new_order = PreOrder(
            customer_name=data['customer_name'],
            customer_phone=data['customer_phone'],
            pickup_datetime=pickup_dt,
            notes=data.get('notes', ''),
            status='DRAFT', 
            payment_preference=data.get('payment_preference'),
            paid_amount=data.get('paid_amount', 0),
            estimated_total=0 
        )
        
        total_estimate = 0
        items_data = data.get('items', [])
        
        # Need to fetch products to ensure prices if not sent by frontend
        # Optimziation: fetch all involved product ids
        product_ids = [i.get('product_id') for i in items_data if i.get('product_id')]
        from app.models.product import Product
        existing_products = {p.id: p for p in Product.query.filter(Product.id.in_(product_ids)).all()}

        for item in items_data:
            pid = item.get('product_id')
            if pid not in existing_products:
                continue # Or raise error
                
            product = existing_products[pid]

            # item needs: product_id, unit_price, qty OR weight
            # FIX: If frontend doesn't send unit_price, take from product
            unit_price = float(item.get('unit_price', 0))
            if unit_price == 0:
                unit_price = float(product.price)

            price_kg = float(item.get('price_per_kg', 0)) if item.get('price_per_kg') else None
            if price_kg is None and product.unit in ['KG', 'G', 'L', 'ML']:
                 price_kg = float(product.price)

            qty = item.get('qty', 1)
            desired_weight = item.get('desired_weight_kg')
            
            # Simple estimation logic
            line_total = 0
            if desired_weight and price_kg:
                # Weighted item logic
                line_total = float(desired_weight) * price_kg
            else:
                # Unit item logic
                line_total = qty * unit_price
                
            total_estimate += line_total
            
            new_item = PreOrderItem(
                product_id=pid,
                qty=qty,
                desired_weight_kg=desired_weight,
                unit_price_snapshot=unit_price,
                price_per_kg_snapshot=price_kg,
                estimated_line_total=line_total,
                notes=item.get('notes')
            )
            new_order.items.append(new_item)
            
        new_order.estimated_total = total_estimate
        
        db.session.add(new_order)
        db.session.commit()
        
        return jsonify(new_order.to_dict()), 201
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'message': 'Erro ao criar encomenda', 'error': str(e)}), 500

@pre_order_bp.route('/<int:id>', methods=['PUT'])
@require_auth
@require_permission('preorders:write')
def update_preorder(id):
    order = PreOrder.query.get_or_404(id)
    data = request.get_json()
    
    # Only allow editing if not passed critical status
    if order.status not in ['DRAFT', 'CONFIRMED']:
        return jsonify({'message': 'Não é possível editar encomenda neste status'}), 400

    try:
        if 'customer_name' in data:
            order.customer_name = data['customer_name']
        if 'customer_phone' in data:
            order.customer_phone = data['customer_phone']
        if 'notes' in data:
            order.notes = data['notes']
        if 'pickup_datetime' in data:
            order.pickup_datetime = datetime.datetime.fromisoformat(data['pickup_datetime'].replace('Z', '+00:00'))
            
        # Update items: Full Replace Strategy
        if 'items' in data:
            # Clear existing items
            # PreOrderItem must have cascade delete? Or manual delete
            PreOrderItem.query.filter_by(preorder_id=order.id).delete()
            
            total_estimate = 0
            items_data = data.get('items', [])
            
            # Fetch products for price references
            product_ids = [i.get('product_id') for i in items_data if i.get('product_id')]
            from app.models.product import Product
            existing_products = {p.id: p for p in Product.query.filter(Product.id.in_(product_ids)).all()}

            for item in items_data:
                pid = item.get('product_id')
                if pid not in existing_products:
                    continue 
                    
                product = existing_products[pid]

                unit_price = float(item.get('unit_price', 0))
                if unit_price == 0:
                    unit_price = float(product.price)

                price_kg = float(item.get('price_per_kg', 0)) if item.get('price_per_kg') else None
                if price_kg is None and product.unit.name in ['KG', 'G', 'L', 'ML']:
                     price_kg = float(product.price)

                qty = item.get('qty', 1)
                desired_weight = item.get('desired_weight_kg')
                
                line_total = 0
                if desired_weight and price_kg:
                    line_total = float(desired_weight) * price_kg
                else:
                    line_total = qty * unit_price
                    
                total_estimate += line_total
                
                new_item = PreOrderItem(
                    preorder_id=order.id, # Link explicitly
                    product_id=pid,
                    qty=qty,
                    desired_weight_kg=desired_weight,
                    unit_price_snapshot=unit_price,
                    price_per_kg_snapshot=price_kg,
                    estimated_line_total=line_total,
                    notes=item.get('notes')
                )
                db.session.add(new_item)
                
            order.estimated_total = total_estimate

        db.session.commit()
        return jsonify(order.to_dict())

    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'message': 'Erro ao atualizar encomenda', 'error': str(e)}), 500

@pre_order_bp.route('/<int:id>/status', methods=['PUT'])
@require_auth
@require_permission('preorders:write')
def update_status(id):
    order = PreOrder.query.get_or_404(id)
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status:
        order.status = new_status
        db.session.commit()
        return jsonify(order.to_dict())
    
    return jsonify({'message': 'Status é obrigatório'}), 400

@pre_order_bp.route('/<int:id>/checkout', methods=['POST'])
@require_auth
@require_permission('preorders:checkout') # Ensure this permission exists or use write
# OR 'sales:create'
def checkout_preorder(id):
    order = PreOrder.query.get_or_404(id)
    data = request.get_json()
    
    if order.status == 'PICKED_UP':
         return jsonify({'message': 'Encomenda já retirada.'}), 400

    # 1. Update Weights and Calculate Final Total
    items_payload = data.get('items', [])
    # items_payload expected: [{ 'id': item_id, 'final_weight_kg': 1.235 }]
    
    final_total_calc = 0
    sale_items = []

    try:
        # Map existing items
        db_items = {i.id: i for i in order.items}
        
        for item_data in items_payload:
            item_id = item_data.get('id')
            if item_id in db_items:
                item = db_items[item_id]
                
                # Update weight if provided
                if 'final_weight_kg' in item_data and item_data['final_weight_kg'] is not None:
                    item.final_weight_kg = float(item_data['final_weight_kg'])
                
                # Calculate Line Total (Final)
                price = item.product.price # Current price? Or snapshot?
                # Use snapshot if available, else current. 
                # Ideally use snapshot from creation.
                unit_price = item.unit_price_snapshot or item.product.price
                price_kg = item.price_per_kg_snapshot or item.product.price
                
                line_total = 0
                qty_for_sale = 0
                price_for_sale = 0
                
                if item.product.unit == 'KG':
                    weight = item.final_weight_kg if item.final_weight_kg is not None else item.desired_weight_kg
                    if weight is None: weight = 0
                    line_total = weight * price_kg
                    item.final_line_total = line_total
                    
                    qty_for_sale = weight
                    price_for_sale = price_kg
                else:
                    qty = item.qty
                    line_total = qty * unit_price
                    item.final_line_total = line_total
                    
                    qty_for_sale = qty
                    price_for_sale = unit_price
                    
                final_total_calc += line_total
                
                sale_items.append({
                    'product_id': item.product_id,
                    'qty': qty_for_sale,
                    'unit_price': price_for_sale,
                    'notes': item.notes
                })
        
        order.final_total = final_total_calc
        
        # 2. Prepare Sale Data
        # Discount = Paid Amount (Signal)
        discount_dto = {}
        if order.paid_amount and order.paid_amount > 0:
            discount_dto = {
                'type': 'FIXED', 
                'value': order.paid_amount
            }
            
        sale_data = {
            'items': sale_items,
            'payments': data.get('payments', []),
            'discount': discount_dto,
            'preorder_id': order.id,
            'customer_id': None # Could link if customer exists
        }
        
        # 3. Create Sale (Delegates validation and logic)
        sale = SaleService.create_sale(sale_data, g.user.id)
        
        # 4. Update Order Status
        order.status = 'PICKED_UP'
        # Final Total is already set above
        db.session.commit()
        
        return jsonify({'message': 'Checkout realizado com sucesso', 'sale_id': sale.id, 'preorder': order.to_dict()}), 200

    except ValueError as Ve:
        db.session.rollback()
        return jsonify({'message': str(Ve)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Erro no checkout', 'error': str(e)}), 500

@pre_order_bp.route('/production-summary', methods=['GET'])
@require_auth
@require_permission('production:read') # Ensure permission exists or use generic
def production_summary():
    """
    Returns aggregated production data for a specific date.
    Two views:
    1. By Product: Total Qty/Weight needed for the day.
    2. By Time: Breakdown of pickup times.
    """
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'message': 'Data é obrigatória (YYYY-MM-DD)'}), 400
        
    try:
        target_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'message': 'Formato de data inválido'}), 400

    # Query all active items for that date (exclude CANCELED)
    # Join PreOrder to filter by date and status
    
    items = db.session.query(PreOrderItem, PreOrder).join(PreOrder).filter(
        db.func.date(PreOrder.pickup_datetime) == target_date,
        PreOrder.status != 'CANCELED'
    ).all()
    
    # Aggregation
    by_product = {}
    by_time = {}
    
    for item, order in items:
        # By Product
        pid = item.product_id
        if pid not in by_product:
            by_product[pid] = {
                'product_id': pid,
                'name': item.product.name,
                'category_id': item.product.category_id,
                'category_name': item.product.category.name if item.product.category else 'Sem Categoria',
                'unit': item.product.unit.value,
                'total_qty': 0,
                'total_weight': 0.0,
                'breakdown': {} # Hour -> {qty, weight}
            }
            
        prod_entry = by_product[pid]
        prod_entry['total_qty'] += item.qty
        if item.desired_weight_kg:
             prod_entry['total_weight'] += float(item.desired_weight_kg)
             
        # Add to product schedule breakdown
        hour = order.pickup_datetime.hour
        time_key = f"{hour:02d}:00"
        
        if time_key not in prod_entry['breakdown']:
            prod_entry['breakdown'][time_key] = {'time': time_key, 'qty': 0, 'weight': 0.0}
        
        prod_entry['breakdown'][time_key]['qty'] += item.qty
        if item.desired_weight_kg:
            prod_entry['breakdown'][time_key]['weight'] += float(item.desired_weight_kg)
             
        # By Time (Hourly buckets) - Keeping existing logic for backward compat/other views
        time_key_range = f"{hour:02d}:00 - {hour+1:02d}:00"
        
        if time_key_range not in by_time:
            by_time[time_key_range] = []
            
        # Add basic info to time bucket
        by_time[time_key_range].append({
            'order_id': order.id,
            'customer': order.customer_name,
            'product': item.product.name,
            'qty': item.qty,
            'weight': float(item.desired_weight_kg) if item.desired_weight_kg else 0.0,
            'unit': item.product.unit.value,
            'notes': item.notes
        })
        
    # Sort By Product (Name) and Format Breakdown
    summary_list = []
    for p in sorted(by_product.values(), key=lambda x: x['name']):
        # Convert breakdown dict to sorted list
        schedule = sorted(p['breakdown'].values(), key=lambda x: x['time'])
        p['schedule'] = schedule
        del p['breakdown'] # Remove temp dict
        summary_list.append(p)
    
    # Sort By Time
    # Convert dict to list of {time: '...', items: []} sorted by time
    time_list = []
    for t in sorted(by_time.keys()):
        time_list.append({
            'time_window': t,
            'items': by_time[t]
        })

    return jsonify({
        'date': date_str,
        'by_product': summary_list,
        'by_time': time_list
    })
