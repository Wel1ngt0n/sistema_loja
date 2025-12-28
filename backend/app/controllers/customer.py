from flask import Blueprint, request, jsonify
from app import db
from app.models.customer import Customer
from app.utils.security import require_auth
from app.utils.decorators import audit_log

customer_bp = Blueprint('customer', __name__, url_prefix='/api/v1/customers')

@customer_bp.route('', methods=['GET'])
@require_auth
def list_customers():
    # Pagination & Search
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '')
    
    query = Customer.query.order_by(Customer.name.asc())
    
    if search:
        query = query.filter(
            (Customer.name.ilike(f'%{search}%')) | 
            (Customer.cpf.ilike(f'%{search}%'))
        )
        
    pagination = query.paginate(page=page, per_page=20)
    
    return jsonify({
        'data': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@customer_bp.route('', methods=['POST'])
@require_auth
@audit_log(action="CREATE_CUSTOMER", resource="CUSTOMER")
def create_customer():
    data = request.get_json()
    
    # Simple validation
    if not data.get('name'):
        return jsonify({'message': 'Nome é obrigatório'}), 400
        
    try:
        customer = Customer(
            name=data.get('name'),
            cpf=data.get('cpf'),
            phone=data.get('phone'),
            email=data.get('email')
        )
        db.session.add(customer)
        db.session.commit()
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        # Check for unique constraint (CPF) although sqlite/pg might throw generic IntegrityError
        if 'unique' in str(e).lower():
             return jsonify({'message': 'CPF já cadastrado'}), 400
        return jsonify({'message': 'Erro ao criar cliente', 'error': str(e)}), 500

@customer_bp.route('/<int:id>', methods=['PUT'])
@require_auth
@audit_log(action="UPDATE_CUSTOMER", resource="CUSTOMER")
def update_customer(id):
    customer = Customer.query.get_or_404(id)
    data = request.get_json()
    
    try:
        if 'name' in data: customer.name = data['name']
        if 'cpf' in data: customer.cpf = data['cpf']
        if 'phone' in data: customer.phone = data['phone']
        if 'email' in data: customer.email = data['email']
        
        db.session.commit()
        return jsonify(customer.to_dict())
    except Exception as e:
        return jsonify({'message': 'Erro ao atualizar cliente', 'error': str(e)}), 500

@customer_bp.route('/<int:id>', methods=['DELETE'])
@require_auth
@audit_log(action="DELETE_CUSTOMER", resource="CUSTOMER")
def delete_customer(id):
    customer = Customer.query.get_or_404(id)
    
    # Tenta deletar fisicamente, se falhar por FK (tem vendas), retornar erro amigável
    try:
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Cliente removido com sucesso'})
    except Exception: # Integrity error likely
        db.session.rollback()
        # Fallback: maybe strip personal data if GDPR? or just block.
        # For this MVP: Return error saying cannot delete
        return jsonify({'message': 'Não é possível excluir cliente com vendas associadas.'}), 400
