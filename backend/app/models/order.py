from app.extensions import db
from datetime import datetime
import enum

class OrderStatus(enum.Enum):
    PENDING = "PENDING"      # Novo pedido (Totem)
    PREPARING = "PREPARING"  # Em preparo (Cozinha)
    READY = "READY"          # Pronto (Aguardando Retirada/Pagamento)
    PAID = "PAID"            # Finalizado (Pago)
    CANCELED = "CANCELED"    # Cancelado

class OrderOrigin(enum.Enum):
    TOTEM = "TOTEM"
    PDV = "PDV"

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), nullable=False) # Senha: 001, 002...
    origin = db.Column(db.Enum(OrderOrigin), default=OrderOrigin.TOTEM, nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=True)
    status = db.Column(db.Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    ready_at = db.Column(db.DateTime, nullable=True)
    paid_at = db.Column(db.DateTime, nullable=True)
    
    notes = db.Column(db.Text, nullable=True)
    
    items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'origin': self.origin.value,
            'device_id': self.device_id,
            'status': self.status.value,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'ready_at': self.ready_at.isoformat() if self.ready_at else None,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'notes': self.notes,
            'items': [i.to_dict() for i in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    # Snapshot dos dados do produto caso mude preço/nome
    # No MVP vou manter relacional simples, mas preço DEVE ser snapshot
    qty = db.Column(db.Numeric(10, 3), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    notes = db.Column(db.String(200), nullable=True)
    kit_selections = db.Column(db.JSON, nullable=True)

    product = db.relationship('Product')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Unknown',
            'qty': float(self.qty),
            'unit_price': float(self.unit_price),
            'total': float(self.qty * self.unit_price),
            'notes': self.notes,
            'kit_selections': self.kit_selections
        }
