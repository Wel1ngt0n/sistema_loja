from flask import Blueprint, request, jsonify, g
from app.services.cashier_service import CashierService
from app.utils.security import require_auth

cashier_bp = Blueprint('cashier', __name__, url_prefix='/api/v1/cashier')

@cashier_bp.route('/status', methods=['GET'])
@require_auth
def get_status():
    session = CashierService.get_open_session(g.user.id)
    if session:
        return jsonify(session.to_dict())
    return jsonify({'status': 'CLOSED'}), 200

@cashier_bp.route('/open', methods=['POST'])
@require_auth
def open_cashier():
    data = request.get_json()
    start_balance = data.get('start_balance', 0.0)
    try:
        session = CashierService.open_session(g.user.id, start_balance)
        return jsonify(session.to_dict()), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

@cashier_bp.route('/close', methods=['POST'])
@require_auth
def close_cashier():
    data = request.get_json()
    end_balance = data.get('end_balance')
    if end_balance is None:
         return jsonify({'message': 'end_balance is required'}), 400
         
    try:
        session = CashierService.close_session(g.user.id, end_balance)
        return jsonify(session.to_dict()), 200
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

@cashier_bp.route('/movements', methods=['POST'])
@require_auth
def add_movement():
    data = request.get_json()
    mov_type = data.get('type') # SUPPLY | WITHDRAW
    amount = data.get('amount')
    reason = data.get('reason')
    
    if not all([mov_type, amount, reason]):
        return jsonify({'message': 'Dados incompletos (type, amount, reason)'}), 400
        
    try:
        movement = CashierService.add_movement(g.user.id, mov_type, amount, reason)
        return jsonify(movement.to_dict()), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
         return jsonify({'message': 'Erro ao processar movimentação', 'error': str(e)}), 500
