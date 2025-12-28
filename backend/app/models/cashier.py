from app.extensions import db
from datetime import datetime
import enum

class CashierStatus(enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"

class MovementType(enum.Enum):
    SUPPLY = "SUPPLY"     # Suprimento (Entrada)
    WITHDRAW = "WITHDRAW" # Sangria (Saída)
    SALE = "SALE"         # Venda (Entrada) - Automático
    REFUND = "REFUND"     # Estorno (Saída) - Automático

class CashierSession(db.Model):
    __tablename__ = 'cashier_sessions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    opened_at = db.Column(db.DateTime, default=datetime.utcnow)
    closed_at = db.Column(db.DateTime, nullable=True)
    
    start_balance = db.Column(db.Numeric(10, 2), default=0.0)
    current_balance = db.Column(db.Numeric(10, 2), default=0.0) # Saldo Teórico
    end_balance = db.Column(db.Numeric(10, 2), nullable=True) # Contagem final
    
    status = db.Column(db.Enum(CashierStatus), default=CashierStatus.OPEN, nullable=False)

    user = db.relationship('User')
    movements = db.relationship('CashMovement', backref='session', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_name': self.user.name if self.user else 'Unknown',
            'opened_at': self.opened_at.isoformat(),
            'closed_at': self.closed_at.isoformat() if self.closed_at else None,
            'start_balance': float(self.start_balance),
            'current_balance': float(self.current_balance),
            'end_balance': float(self.end_balance) if self.end_balance is not None else None,
            'status': self.status.value
        }

class CashMovement(db.Model):
    __tablename__ = 'cash_movements'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('cashier_sessions.id'), nullable=False)
    
    type = db.Column(db.Enum(MovementType), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    reason = db.Column(db.String(255), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Quem fez a sangria/suprimento

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type.value,
            'amount': float(self.amount),
            'reason': self.reason,
            'created_at': self.created_at.isoformat(),
            'created_by': self.created_by
        }
