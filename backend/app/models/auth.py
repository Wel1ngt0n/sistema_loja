from datetime import datetime
from app.extensions import db
import uuid

# Tabelas de Associação
user_roles = db.Table('user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True)
)

role_permissions = db.Table('role_permissions',
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True),
    db.Column('permission_id', db.Integer, db.ForeignKey('permissions.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    active = db.Column(db.Boolean, default=True)
    must_change_password = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = db.Column(db.DateTime, nullable=True)

    roles = db.relationship('Role', secondary=user_roles, backref=db.backref('users', lazy='dynamic'))

    def has_permission(self, perm_code):
        for role in self.roles:
            if not role.active: continue
            for perm in role.permissions:
                if perm.code == perm_code and perm.active:
                    return True
        return False
    
    def is_super_admin(self):
        for role in self.roles:
            if role.name == 'SUPER_ADMIN': return True
        return False

class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False) # SUPER_ADMIN, ADMIN, CASHIER, etc.
    description = db.Column(db.String(200), nullable=True)
    is_system = db.Column(db.Boolean, default=False) # Se true, não pode deletar
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    permissions = db.relationship('Permission', secondary=role_permissions, backref=db.backref('roles', lazy='dynamic'))

class Permission(db.Model):
    __tablename__ = 'permissions'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(100), unique=True, nullable=False) # ex: products:read
    description = db.Column(db.String(200), nullable=True)
    active = db.Column(db.Boolean, default=True)

class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token_hash = db.Column(db.String(128), nullable=False, index=True) # Hash do cookie
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(200), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    revoked_at = db.Column(db.DateTime, nullable=True)
    last_seen_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='sessions')

    @property
    def is_active(self):
        return self.revoked_at is None and self.expires_at > datetime.utcnow()

class Device(db.Model):
    __tablename__ = 'devices'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False) # ex: Totem 01
    token_hash = db.Column(db.String(128), nullable=False, index=True)
    active = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen_at = db.Column(db.DateTime, nullable=True)
    allowed_ip_range = db.Column(db.String(100), nullable=True) # Opcional
    notes = db.Column(db.Text, nullable=True)

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    actor_user_id = db.Column(db.Integer, nullable=True) # Se foi user
    actor_device_id = db.Column(db.Integer, nullable=True) # Se foi Totem
    
    action = db.Column(db.String(50), nullable=False) # ex: LOGIN, CREATE_ORDER
    resource = db.Column(db.String(50), nullable=False) # ex: ORDER, PRODUCT
    entity_id = db.Column(db.String(50), nullable=True) # ID do objeto afetado
    
    before_json = db.Column(db.JSON, nullable=True)
    after_json = db.Column(db.JSON, nullable=True)
    
    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
