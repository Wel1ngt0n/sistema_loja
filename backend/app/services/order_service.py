from app import db
from app.models.order import Order, OrderItem, OrderStatus, OrderOrigin
from app.models.product import Product
from datetime import datetime

class OrderService:
    @staticmethod
    def generate_order_number():
        # Lógica simples: contar pedidos do dia + 1. 
        # Idealmente usar sequence do banco ou Redis para evitar colisão em alta concorrencia.
        today = datetime.now().strftime('%Y-%m-%d')
        count = Order.query.filter(Order.created_at >= today).count()
        return f"{count + 1:03d}"

    @staticmethod
    def create_order(data):
        # data = { origin: 'TOTEM', items: [{product_id, qty, notes}], notes: '' }
        
        origin = OrderOrigin(data.get('origin', 'TOTEM'))
        order_number = OrderService.generate_order_number()
        
        order = Order(
            order_number=order_number,
            origin=origin,
            status=OrderStatus.PENDING,
            notes=data.get('notes')
        )
        
        total = 0
        
        for item_data in data.get('items', []):
            product = Product.query.get(item_data['product_id'])
            if not product or not product.active:
                raise ValueError(f"Product {item_data['product_id']} invalid or inactive")

            qty = float(item_data['qty'])
            if qty <= 0:
                 raise ValueError("Quantity must be positive")

            item = OrderItem(
                product=product,
                qty=qty, # No MVP, assume qty suficiente ou não checa stock na criação, só na venda (conforme requisito)
                unit_price=product.price,
                notes=item_data.get('notes')
            )
            order.items.append(item)
            
        db.session.add(order)
        db.session.commit()
        
        try:
            from app.services.printer_service import PrinterService
            PrinterService.print_ticket(order)
        except Exception as e:
            print(f"Printer Error: {e}")
            
        try:
            from app.extensions import socketio
            socketio.emit('new_order', order.to_dict())
        except Exception as e:
            print(f"Socket Error: {e}")
        
        return order

    @staticmethod
    def update_status(order_id, new_status_str):
        order = Order.query.get(order_id)
        if not order:
            raise ValueError("Order not found")
            
        if new_status_str not in OrderStatus.__members__:
             raise ValueError(f"Invalid status: {new_status_str}")
             
        new_status = OrderStatus[new_status_str]
        order.status = new_status
        
        if new_status == OrderStatus.READY:
            order.ready_at = datetime.utcnow()
            
        # Optional: Logic for PAID -> paid_at handles in PaymentService usually, but safe to add here if manual update
        if new_status == OrderStatus.PAID:
            order.paid_at = datetime.utcnow()
            
        db.session.commit()
        
        # Notify via Socket
        try:
             from app.extensions import socketio
             socketio.emit('order_updated', order.to_dict())
        except:
             pass
             
        return order
