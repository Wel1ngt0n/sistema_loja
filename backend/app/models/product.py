from app.extensions import db
import enum
from datetime import datetime

class ProductUnit(enum.Enum):
    UN = "UN"
    KG = "KG"
    G = "G"
    PORCAO = "PORCAO"

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    barcode = db.Column(db.String(50), nullable=True) # New field
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    unit = db.Column(db.Enum(ProductUnit), default=ProductUnit.UN, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    active = db.Column(db.Boolean, default=True)
    
    # Controle de Estoque
    controls_stock = db.Column(db.Boolean, default=False)
    stock_qty = db.Column(db.Integer, default=0) # Changed from Numeric(10,3) to Integer
    
    # Totem
    available_in_totem = db.Column(db.Boolean, default=True)
    featured = db.Column(db.Boolean, default=False)
    upsell = db.Column(db.Boolean, default=False)
    image_url = db.Column(db.String(500), nullable=True) # Updated length from 255 to 500
    description = db.Column(db.Text, nullable=True)

    # Kit / Combos
    is_kit = db.Column(db.Boolean, default=False)
    kit_options = db.Column(db.JSON, nullable=True) # List of config objects

    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'id': self.id,
            'name': self.name,
            'barcode': self.barcode,
            'category_id': self.category_id,
            'unit': self.unit.value,
            'price': float(self.price) if self.price else 0.0,
            'active': self.active,
            'controls_stock': self.controls_stock,
            'stock_qty': float(self.stock_qty) if self.stock_qty else 0.0,
            'available_in_totem': self.available_in_totem,
            'featured': self.featured,
            'upsell': self.upsell,
            'image_url': self.image_url,
            'description': self.description or "",
            'is_kit': self.is_kit,
            'kit_options': self.kit_options
        }
