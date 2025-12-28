from flask import Blueprint, request, jsonify, g
from app.services.payment_service import PaymentService
from app.utils.security import require_auth

payment_bp = Blueprint('payment', __name__, url_prefix='/api/v1/payments')

@payment_bp.route('', methods=['POST'])
@require_auth
def create_payment():
    data = request.get_json()
    try:
        payment = PaymentService.process_payment(
            user_id=g.user.id,
            order_id=data['order_id'],
            method=data['method'],
            amount=data['amount']
        )
        return jsonify(payment.to_dict()), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Error processing payment', 'error': str(e)}), 500
