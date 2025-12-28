import datetime
from functools import wraps
from flask import request, jsonify, current_app, make_response, g
from app.extensions import db, bcrypt
from app.models.auth import User, Session
import secrets
import hashlib

# --- Password Helpers ---
def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

def check_password(password, hashed):
    return bcrypt.check_password_hash(hashed, password)

# --- Session Management ---
def hash_token(token):
    return hashlib.sha256(token.encode()).hexdigest()

def create_session(user, user_agent=None, ip_address=None):
    token = secrets.token_urlsafe(64)
    token_hash = hash_token(token)
    
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(hours=12) # 12h session
    
    session = Session(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        user_agent=user_agent,
        ip_address=ip_address
    )
    db.session.add(session)
    db.session.commit()
    return token, expires_at

def revoke_session(token):
    if not token: return
    token_hash = hash_token(token)
    session = Session.query.filter_by(token_hash=token_hash).first()
    if session:
        session.revoked_at = datetime.datetime.utcnow()
        db.session.commit()

# --- Decorators ---
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('session_id')
        if not token:
            return jsonify({'message': 'Authentication required'}), 401
        
        token_hash = hash_token(token)
        session = Session.query.filter_by(token_hash=token_hash).first()
        
        if not session or not session.is_active:
             return jsonify({'message': 'Session expired or invalid'}), 401
             
        # Update last_seen
        if (datetime.datetime.utcnow() - session.last_seen_at).total_seconds() > 300:
             session.last_seen_at = datetime.datetime.utcnow()
             db.session.commit()

        # CSRF Check for mutating methods
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            csrf_header = request.headers.get('X-CSRF-Token')
            csrf_cookie = request.cookies.get('csrf_token')
            if not csrf_header or not csrf_cookie or csrf_header != csrf_cookie:
                return jsonify({'message': 'CSRF verification failed'}), 403

        g.user = session.user
        if not g.user.active:
             return jsonify({'message': 'User disabled'}), 403

        return f(*args, **kwargs)
    return decorated

def require_device_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('X-Device-Token')
        if not token:
             return jsonify({'message': 'Device Token required'}), 401
        
        token_hash = hash_token(token)
        from app.models.auth import Device # local import to avoid cycle if any
        device = Device.query.filter_by(token_hash=token_hash).first()
        
        if not device or not device.active:
             return jsonify({'message': 'Invalid or inactive device'}), 401
             
        # Update last seen occasionally
        if not device.last_seen_at or (datetime.datetime.utcnow() - device.last_seen_at).total_seconds() > 300:
            device.last_seen_at = datetime.datetime.utcnow()
            db.session.commit()
            
        g.device = device
        return f(*args, **kwargs)
    return decorated

def require_permission(perm_code):
    def decorator(f):
        @wraps(f)
        @require_auth
        def wrapper(*args, **kwargs):
            # require_auth already ran and set g.user
            if g.user.is_super_admin():
                return f(*args, **kwargs)
            
            if g.user.has_permission(perm_code):
                return f(*args, **kwargs)
                
            return jsonify({'message': f'Permission denied: {perm_code}'}), 403
        return wrapper
    return decorator
