from app.extensions import db

class PreOrderItem(db.Model):
    __tablename__ = 'pre_order_items'

    id = db.Column(db.Integer, primary_key=True)
    preorder_id = db.Column(db.Integer, db.ForeignKey('pre_orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    qty = db.Column(db.Integer, default=1, nullable=False)
    
    # For weight-based items
    desired_weight_kg = db.Column(db.Numeric(10, 3), nullable=True)
    final_weight_kg = db.Column(db.Numeric(10, 3), nullable=True)
    
    # Snapshots to preserve price at time of order
    unit_price_snapshot = db.Column(db.Numeric(10, 2), nullable=False)
    price_per_kg_snapshot = db.Column(db.Numeric(10, 2), nullable=True)
    
    estimated_line_total = db.Column(db.Numeric(10, 2), nullable=False)
    final_line_total = db.Column(db.Numeric(10, 2), nullable=True)
    
    notes = db.Column(db.String(200), nullable=True)

    # Relationships
    product = db.relationship('Product', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'preorder_id': self.preorder_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Produto Removido',
            'qty': self.qty,
            'desired_weight_kg': float(self.desired_weight_kg) if self.desired_weight_kg else None,
            'final_weight_kg': float(self.final_weight_kg) if self.final_weight_kg else None,
            'unit_price_snapshot': float(self.unit_price_snapshot) if self.unit_price_snapshot else 0.0,
            'price_per_kg_snapshot': float(self.price_per_kg_snapshot) if self.price_per_kg_snapshot else None,
            'estimated_line_total': float(self.estimated_line_total) if self.estimated_line_total else 0.0,
            'final_line_total': float(self.final_line_total) if self.final_line_total else None,
            'notes': self.notes,
            'product': {
                'id': self.product.id,
                'name': self.product.name,
                'unit': self.product.unit,
                'price': float(self.product.price)
            } if self.product else None
        }
