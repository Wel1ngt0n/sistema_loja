from app.extensions import db
from datetime import datetime

class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    cpf = db.Column(db.String(14), unique=True, nullable=True) # 000.000.000-00
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'cpf': self.cpf,
            'phone': self.phone,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }
