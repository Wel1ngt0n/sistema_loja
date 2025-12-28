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
            return jsonify({'message': 'Missing required fields'}), 400
            
        pickup_dt = datetime.datetime.fromisoformat(data['pickup_datetime'].replace('Z', '+00:00'))
        
        new_order = PreOrder(
            customer_name=data['customer_name'],
            customer_phone=data['customer_phone'],
            pickup_datetime=pickup_dt,
            notes=data.get('notes', ''),
            status='DRAFT', # Explicitly starting as DRAFT or CONFIRMED depending on logic?
            payment_preference=data.get('payment_preference'),
            paid_amount=data.get('paid_amount', 0),
            estimated_total=0 # Will calc below
        )
        
        total_estimate = 0
        items_data = data.get('items', [])
        
        for item in items_data:
            # item needs: product_id, unit_price, qty OR weight
            unit_price = float(item.get('unit_price', 0))
            price_kg = float(item.get('price_per_kg', 0)) if item.get('price_per_kg') else None
            
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
                product_id=item['product_id'],
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
        db.session.rollback()
        return jsonify({'message': 'Error creating preorder', 'error': str(e)}), 500

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
    
    return jsonify({'message': 'Status required'}), 400

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
        return jsonify({'message': 'Date is required (YYYY-MM-DD)'}), 400
        
    try:
        target_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'message': 'Invalid date format'}), 400

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
                'unit': item.product.unit,
                'total_qty': 0,
                'total_weight': 0.0
            }
            
        by_product[pid]['total_qty'] += item.qty
        if item.desired_weight_kg:
             by_product[pid]['total_weight'] += item.desired_weight_kg
             
        # By Time (Hourly buckets)
        hour = order.pickup_datetime.hour
        time_key = f"{hour:02d}:00 - {hour+1:02d}:00"
        
        if time_key not in by_time:
            by_time[time_key] = []
            
        # Add basic info to time bucket
        by_time[time_key].append({
            'order_id': order.id,
            'customer': order.customer_name,
            'product': item.product.name,
            'qty': item.qty,
            'weight': item.desired_weight_kg,
            'unit': item.product.unit,
            'notes': item.notes
        })
        
    # Sort By Product (Name)
    summary_list = sorted(by_product.values(), key=lambda x: x['name'])
    
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
