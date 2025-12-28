from app.extensions import db
from datetime import datetime
import enum

class PaymentMethod(enum.Enum):
    CASH = "CASH"
    CREDIT_CARD = "CREDIT_CARD"
    DEBIT_CARD = "DEBIT_CARD"
    PIX = "PIX"

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=True) # Nullable for migration compatibility
    cashier_session_id = db.Column(db.Integer, db.ForeignKey('cashier_sessions.id'), nullable=True)
    
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    method = db.Column(db.Enum(PaymentMethod), nullable=False)
    
    # Campo apenas informativo de troco (não muda o valor real pago)
    change_amount = db.Column(db.Numeric(10, 2), default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamento Sale (já definido em Sale backref='payments')
    # Relacionamento CashierSession
    cashier_session = db.relationship('CashierSession', backref='payments')

    def to_dict(self):
        return {
            'id': self.id,
            'sale_id': self.sale_id,
            'amount': float(self.amount),
            'method': self.method.value,
            'change_amount': float(self.change_amount),
            'created_at': self.created_at.isoformat()
        }
