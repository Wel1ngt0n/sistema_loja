from flask import Blueprint, request, jsonify, g
from app.services.sale_service import SaleService
from app.models.product import Product
from app.models.category import Category
from app.utils.security import require_auth, require_permission

sales_bp = Blueprint('sales', __name__, url_prefix='/api/v1/pdv')

@sales_bp.route('/sales', methods=['POST'])
@require_auth
# @require_permission('sales:create') # TODO: Add permission
def create_sale():
    data = request.get_json()
    
    # Check permissions for discount
    discount_data = data.get('discount', {})
    if discount_data.get('type') and discount_data.get('type') != 'NONE':
        # Verify if value is > 0 to really count as discount
        try:
             val = float(discount_data.get('value', 0))
             if val > 0:
                 if not g.user.has_permission('sales:apply_discount') and not g.user.is_super_admin():
                     return jsonify({'message': 'Permissão negada para aplicar descontos (sales:apply_discount)'}), 403
        except:
             pass

    try:
        sale = SaleService.create_sale(data, g.user.id)
        return jsonify(sale.to_dict()), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Erro ao processar venda', 'error': str(e)}), 500

@sales_bp.route('/sales/<int:id>/print', methods=['POST'])
@require_auth
def print_sale(id):
    try:
        from app.services.printer_service import PrinterService
        PrinterService.print_sale(id)
        return jsonify({'message': 'Impresso com sucesso'})
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Erro ao imprimir', 'error': str(e)}), 500

@sales_bp.route('/products', methods=['GET'])
@require_auth
def search_products():
    """
    Busca otimizada para o PDV (Nome, SKU, Código de Barras)
    """
    search = request.args.get('search', '')
    category_id = request.args.get('category_id')
    
    query = Product.query.filter_by(active=True)
    
    if search:
        # Busca por nome ou ID (simulando codigo de barras se fosse numérico campo separado)
        # Se tiver campo 'barcode', adicionar aqui. Por enquanto nome e ID.
        if search.isdigit():
             query = query.filter((Product.id == int(search)) | (Product.name.ilike(f'%{search}%')))
        else:
            query = query.filter(Product.name.ilike(f'%{search}%'))
            
    if category_id:
        query = query.filter_by(category_id=category_id)
        
    products = query.limit(50).all()
    return jsonify([p.to_dict() for p in products])
