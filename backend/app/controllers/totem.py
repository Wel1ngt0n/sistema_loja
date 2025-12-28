from flask import Blueprint, jsonify, request
from app.models.product import Product
from app.models.category import Category
from app.utils.security import require_device_token

totem_bp = Blueprint('totem', __name__, url_prefix='/api/v1/totem')

@totem_bp.route('/menu', methods=['GET'])
@require_device_token
def get_menu():
    """
    Retorna menu otimizado para o Totem.
    - Categorias ativas
    - Produtos ativos e available_in_totem
    - Inclui flags featured/upsell
    """
    # 1. Buscar Categorias Ativas
    categories = Category.query.filter_by(active=True).order_by(Category.sort_order).all()
    
    # 2. Buscar Produtos do Totem
    products = Product.query.filter_by(active=True, available_in_totem=True).all()
    
    # 3. Montar Resposta
    return jsonify({
        'categories': [
            {
                'id': c.id, 
                'name': c.name
            } for c in categories
        ],
        'products': [p.to_dict() for p in products]
    })
