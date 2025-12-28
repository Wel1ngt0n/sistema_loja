from app import db
from app.models.payment import Payment, PaymentMethod
from app.models.order import Order, OrderStatus
from app.services.cashier_service import CashierService

class PaymentService:
    @staticmethod
    def process_payment(user_id, order_id, method, amount):
        # Verificar Caixa Aberto
        session = CashierService.get_open_session(user_id)
        if not session:
            raise ValueError("Cashier is closed")
            
        order = Order.query.get(order_id)
        if not order:
             raise ValueError("Order not found")
        
        if order.status == OrderStatus.PAID:
            raise ValueError("Order already paid")

        # Registrar Pagamento
        payment_method = PaymentMethod(method)
        payment = Payment(
            order_id=order_id,
            cashier_session_id=session.id,
            method=payment_method,
            amount=amount
        )
        db.session.add(payment)
        
        # Atualizar saldo do caixa se for dinheiro
        if payment_method == PaymentMethod.CASH:
            CashierService.update_balance(session.id, amount)
            
        # Verificar se total pago cobre o pedido
        # Por simplificacao MVP, assumimos pagamento total em 1x por enquanto
        # TODO: Somar pagamentos anteriores se houver parcial
        
        total_items = sum(item.qty * item.unit_price for item in order.items)
        # float fix
        total_items = float(total_items)
        amount = float(amount)
        
        if amount >= total_items:
            order.status = OrderStatus.PAID
            # Se for pedido de balcão ou totem, ao pagar vai para PREPARO?
            # Vamos definir: PAID -> IN_PREP automatico? Ou Kitchen pega depois?
            # Vamos deixar PAID.
            
        db.session.commit()
        return payment
