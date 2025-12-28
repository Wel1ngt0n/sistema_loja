from app.extensions import db
from datetime import datetime

class PreOrder(db.Model):
    __tablename__ = 'pre_orders'

    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    pickup_datetime = db.Column(db.DateTime, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    
    # ENUM values: DRAFT, CONFIRMED, READY_FOR_PICKUP, PICKED_UP, CANCELED
    status = db.Column(db.String(50), default='DRAFT', nullable=False)
    
    # ENUM values: CASH, PIX, CREDIT, DEBIT
    payment_preference = db.Column(db.String(50), nullable=True)
    
    estimated_total = db.Column(db.Numeric(10, 2), default=0.0)
    final_total = db.Column(db.Numeric(10, 2), nullable=True)
    paid_amount = db.Column(db.Numeric(10, 2), default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = db.relationship('PreOrderItem', backref='pre_order', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'pickup_datetime': self.pickup_datetime.isoformat() if self.pickup_datetime else None,
            'notes': self.notes,
            'status': self.status,
            'payment_preference': self.payment_preference,
            'estimated_total': float(self.estimated_total) if self.estimated_total else 0.0,
            'final_total': float(self.final_total) if self.final_total else None,
            'paid_amount': float(self.paid_amount) if self.paid_amount else 0.0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }
