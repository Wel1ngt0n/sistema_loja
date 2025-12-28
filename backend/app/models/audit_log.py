from app.extensions import db
from datetime import datetime

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Nullable for system actions or unauth attempts
    
    action = db.Column(db.String(100), nullable=False) # e.g. 'CREATE_PRODUCT', 'DELETE_CUSTOMER'
    resource = db.Column(db.String(50), nullable=True) # e.g. 'PRODUCT', 'CUSTOMER'
    resource_id = db.Column(db.String(50), nullable=True) # ID of the affected resource
    
    details = db.Column(db.JSON, nullable=True) # Old/New values or other metadata
    ip_address = db.Column(db.String(50), nullable=True)
    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User')

    def to_dict(self):
        return {
            'id': self.id,
            'user_name': self.user.name if self.user else 'System',
            'action': self.action,
            'resource': self.resource,
            'details': self.details,
            'timestamp': self.timestamp.isoformat()
        }
