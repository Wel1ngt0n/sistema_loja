from flask import Blueprint, request, jsonify
from app.models.auth import User, Role, Device
from app.utils.security import require_permission, require_auth, hash_password, hash_token
from app import db
import secrets

super_admin_bp = Blueprint('super_admin', __name__, url_prefix='/api/v1/superadmin')

# --- USERS ---
@super_admin_bp.route('/users', methods=['GET'])
@require_auth
@require_permission('users:manage')
def list_users():
    users = User.query.all()
    return jsonify([{
        'id': u.id, 'username': u.username, 'active': u.active, 
        'roles': [r.name for r in u.roles]
    } for u in users])

@super_admin_bp.route('/users', methods=['POST'])
@require_auth
@require_permission('users:manage')
def create_user():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username exists'}), 400
    
    new_user = User(
        username=data['username'],
        name=data.get('name', ''),
        password_hash=hash_password(data['password']),
        active=True
    )
    
    # Assign roles
    if 'roles' in data:
        for r_name in data['roles']:
            role = Role.query.filter_by(name=r_name).first()
            if role: new_user.roles.append(role)
            
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created', 'id': new_user.id}), 201

@super_admin_bp.route('/users/<int:id>', methods=['PUT'])
@require_auth
@require_permission('users:manage')
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data:
        user.name = data['name']
    
    if 'password' in data and data['password']:
        user.password_hash = hash_password(data['password'])
        
    if 'active' in data:
        user.active = bool(data['active'])
        
    if 'roles' in data:
        # Clear existing roles and add new ones
        user.roles = []
        for r_name in data['roles']:
            role = Role.query.filter_by(name=r_name).first()
            if role: user.roles.append(role)
            
    db.session.commit()
    return jsonify({'message': 'User updated'})

@super_admin_bp.route('/users/<int:id>', methods=['DELETE'])
@require_auth
@require_permission('users:manage')
def delete_user(id):
    user = User.query.get_or_404(id)
    if user.username == 'admin': # Prevent deleting main admin
        return jsonify({'message': 'Cannot delete system admin'}), 403
        
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted'})
    except Exception:
        db.session.rollback()
        return jsonify({'message': 'Cannot delete user (likely has related data). Try deactivating instead.'}), 400

# --- DEVICES (TOTEM) ---
@super_admin_bp.route('/devices', methods=['GET'])
@require_auth
@require_permission('devices:manage')
def list_devices():
    devices = Device.query.all()
    return jsonify([{
        'id': d.id, 'name': d.name, 'active': d.active, 
        'last_seen': d.last_seen_at.isoformat() if d.last_seen_at else None
    } for d in devices])

@super_admin_bp.route('/devices', methods=['POST'])
@require_auth
@require_permission('devices:manage')
def create_device():
    data = request.get_json()
    name = data.get('name')
    if not name: return jsonify({'message': 'Name required'}), 400
    
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_token(raw_token)
    
    device = Device(name=name, token_hash=token_hash, active=True)
    db.session.add(device)
    db.session.commit()
    
    # Return raw token ONLY NOW
    return jsonify({
        'message': 'Device created',
        'id': device.id,
        'token': raw_token, 
        'warning': 'Copy this token now. It will never be shown again.'
    }), 201

@super_admin_bp.route('/devices/<int:id>', methods=['DELETE'])
@require_auth
@require_permission('devices:manage')
def delete_device(id):
    device = Device.query.get_or_404(id)
    try:
        db.session.delete(device)
        db.session.commit()
        return jsonify({'message': 'Device deleted'})
    except Exception:
        db.session.rollback()
        return jsonify({'message': 'Cannot delete device'}), 400
