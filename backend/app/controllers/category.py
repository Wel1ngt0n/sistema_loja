from flask import Blueprint, request, jsonify
from app.models.category import Category
from app.extensions import db
from app.utils.security import require_auth, require_permission

category_bp = Blueprint('categories', __name__, url_prefix='/api/v1')

@category_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.sort_order.asc(), Category.name.asc()).all()
    return jsonify([c.to_dict() for c in categories])

@category_bp.route('/categories', methods=['POST'])
@require_auth
@require_permission('products:write') # Usually managed with products
def create_category():
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'message': 'Name required'}), 400
        
    cat = Category(name=data['name'])
    db.session.add(cat)
    db.session.commit()
    db.session.commit()
    return jsonify(cat.to_dict()), 201

@category_bp.route('/categories/<int:id>', methods=['PUT'])
@require_auth
@require_permission('products:write')
def update_category(id):
    cat = Category.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        cat.name = data['name']
    if 'sort_order' in data:
        cat.sort_order = data['sort_order']
    if 'active' in data:
        cat.active = data['active']
        
    db.session.commit()
    return jsonify(cat.to_dict())

@category_bp.route('/categories/<int:id>', methods=['DELETE'])
@require_auth
@require_permission('products:write')
def delete_category(id):
    cat = Category.query.get_or_404(id)
    db.session.delete(cat)
    db.session.commit()
    return jsonify({'message': 'Category deleted'})
