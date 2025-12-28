from flask import Blueprint, request, jsonify, g
from app.services.order_service import OrderService
from app.models.order import Order
from app.utils.security import require_auth, require_permission, require_device_token, hash_token
from app.models.auth import Device, Session
from app.extensions import db
import datetime

order_bp = Blueprint('orders', __name__, url_prefix='/api/v1')

# Hybrid Auth Decorator for Create Order
def require_auth_or_device(f):
    def wrapper(*args, **kwargs):
        # 1. Try Device Token
        token = request.headers.get('X-Device-Token')
        if token:
            token_hash = hash_token(token)
            device = Device.query.filter_by(token_hash=token_hash).first()
            if device and device.active:
                # Update last seen
                if not device.last_seen_at or (datetime.datetime.utcnow() - device.last_seen_at).total_seconds() > 300:
                    device.last_seen_at = datetime.datetime.utcnow()
                    db.session.commit()
                return f(*args, **kwargs) # Allow access as Device
                
        # 2. Try User Session
        session_token = request.cookies.get('session_id')
        if session_token:
            token_hash = hash_token(session_token)
            session = Session.query.filter_by(token_hash=token_hash).first()
            if session and session.is_active:
                if (datetime.datetime.utcnow() - session.last_seen_at).total_seconds() > 300:
                    session.last_seen_at = datetime.datetime.utcnow()
                    db.session.commit()
                if session.user.active:
                    return f(*args, **kwargs) # Allow access as User

        return jsonify({'message': 'Authentication required (User or Device)'}), 401
    return wrapper

@order_bp.route('/orders', methods=['POST'])
@require_auth_or_device
def create_order():
    try:
        data = request.get_json()
        
        # Inject device_id if authenticated via Device Token
        token = request.headers.get('X-Device-Token')
        if token:
            token_hash = hash_token(token)
            device = Device.query.filter_by(token_hash=token_hash).first()
            if device:
                data['device_id'] = device.id
                
        order = OrderService.create_order(data)
        return jsonify(order.to_dict()), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Error creating order', 'error': str(e)}), 500

@order_bp.route('/orders/<int:id>', methods=['GET'])
@require_auth
@require_permission('orders:read')
def get_order(id):
    order = Order.query.get_or_404(id)
    return jsonify(order.to_dict())

@order_bp.route('/orders', methods=['GET'])
@order_bp.route('/pdv/orders', methods=['GET'])
@require_auth
@require_permission('orders:read')
def list_orders():
    # Filtros de status (ex: ?status=CREATED,IN_PREP)
    status_filter = request.args.get('status')
    query = Order.query.order_by(Order.created_at.desc())
    
    if status_filter:
        statuses = status_filter.split(',')
        query = query.filter(Order.status.in_(statuses))
        
    orders = query.all()
    return jsonify([o.to_dict() for o in orders])

@order_bp.route('/orders/<int:id>/status', methods=['PUT'])
@require_auth
@require_permission('orders:write')
def update_order_status(id):
    try:
        data = request.get_json()
        status = data.get('status')
        if not status:
            return jsonify({'message': 'Status required'}), 400
            
        order = OrderService.update_status(id, status)
        return jsonify(order.to_dict())
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Error updating status', 'error': str(e)}), 500
