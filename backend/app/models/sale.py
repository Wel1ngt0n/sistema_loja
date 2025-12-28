from app.extensions import db
from datetime import datetime
import enum

class SaleStatus(enum.Enum):
    COMPLETED = "COMPLETED"
    CANCELED = "CANCELED"

class DiscountType(enum.Enum):
    NONE = "NONE"
    FIXED = "FIXED"
    PERCENT = "PERCENT"

class Sale(db.Model):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    
    # Link opcional com Order (Totem)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=True)
    # Link opcional com PreOrder
    preorder_id = db.Column(db.Integer, db.ForeignKey('pre_orders.id'), nullable=True)
    
    # Operador que realizou a venda
    cashier_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Sessão do Caixa
    cashier_session_id = db.Column(db.Integer, db.ForeignKey('cashier_sessions.id'), nullable=False)
    
    # Cliente (Opcional)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=True)
    
    # Valores
    subtotal_value = db.Column(db.Numeric(10, 2), default=0.0)
    discount_type = db.Column(db.Enum(DiscountType), default=DiscountType.NONE)
    discount_value = db.Column(db.Numeric(10, 2), default=0.0) # Valor em R$ ou %
    total_value = db.Column(db.Numeric(10, 2), default=0.0)
    
    status = db.Column(db.Enum(SaleStatus), default=SaleStatus.COMPLETED)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    items = db.relationship('SaleItem', backref='sale', lazy=True, cascade="all, delete-orphan")
    payments = db.relationship('Payment', backref='sale', lazy=True)
    customer = db.relationship('Customer')
    pre_order = db.relationship('PreOrder', backref='sales', lazy=True)
    cashier = db.relationship('User', foreign_keys=[cashier_user_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'cashier_user_id': self.cashier_user_id,
            'user_name': self.cashier.name if self.cashier else 'Unknown',
            'subtotal': float(self.subtotal_value),
            'discount_type': self.discount_type.value,
            'discount_value': float(self.discount_value),
            'total': float(self.total_value),
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'items': [i.to_dict() for i in self.items],
            'customer': self.customer.to_dict() if self.customer else None,
            'payments': [p.to_dict() for p in self.payments],
            'preorder_id': self.preorder_id
        }

class SaleItem(db.Model):
    __tablename__ = 'sale_items'

    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    qty = db.Column(db.Numeric(10, 3), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False) # Snapshot do preço
    total_price = db.Column(db.Numeric(10, 2), nullable=False) # qty * unit_price
    
    notes = db.Column(db.String(200), nullable=True)

    product = db.relationship('Product')

    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product.name if self.product else 'Unknown',
            'product_id': self.product_id,
            'qty': float(self.qty),
            'unit_price': float(self.unit_price),
            'total_price': float(self.total_price),
            'notes': self.notes
        }
