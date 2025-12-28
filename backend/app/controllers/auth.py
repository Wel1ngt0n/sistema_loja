from flask import Blueprint, request, jsonify, make_response, g
from app.models.auth import User
from app.utils.security import check_password, create_session, revoke_session, require_auth
from app import db
import secrets

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400

    user = User.query.filter_by(username=data.get('username')).first()

    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401

    if not user.active:
        return jsonify({'message': 'User disabled'}), 403

    if check_password(data.get('password'), user.password_hash):
        token, expires_at = create_session(user, request.user_agent.string, request.remote_addr)
        csrf_token = secrets.token_hex(32)
        
        resp = make_response(jsonify({'message': 'Login successful', 'user': _user_to_dict(user)}))
        resp.set_cookie('session_id', token, httponly=True, samesite='Lax', expires=expires_at)
        resp.set_cookie('csrf_token', csrf_token, httponly=False, samesite='Lax', expires=expires_at)
        return resp
        
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    token = request.cookies.get('session_id')
    revoke_session(token)
    resp = make_response(jsonify({'message': 'Logged out'}))
    resp.set_cookie('session_id', '', expires=0)
    resp.set_cookie('csrf_token', '', expires=0)
    return resp

# ...
@auth_bp.route('/me', methods=['GET'])
@require_auth
def get_me():
    return jsonify(_user_to_dict(g.user))

def _user_to_dict(user):
    permissions = set()
    for role in user.roles:
        if role.active:
            for p in role.permissions:
                if p.active:
                    permissions.add(p.code)
    
    return {
        'id': user.id,
        'username': user.username,
        'name': user.name,
        'is_super_admin': user.is_super_admin(),
        'roles': [r.name for r in user.roles],
        'permissions': list(permissions)
    }
