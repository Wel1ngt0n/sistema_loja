from app.extensions import db
from app.models.sale import Sale, SaleItem, SaleStatus, DiscountType
from app.models.payment import Payment, PaymentMethod
from app.models.product import Product
from app.models.cashier import CashierSession, CashierStatus, CashMovement, MovementType
from datetime import datetime

from app.models.order import Order, OrderStatus
from app.models.pre_order import PreOrder

class SaleService:
    @staticmethod
    def create_sale(data, user_id):
        """
        Cria uma nova venda manual.
        data: {
            'items': [{'product_id': 1, 'qty': 2, 'unit_price': 10.0, 'notes': ''}],
            'payments': [{'method': 'CASH', 'amount': 20.0}],
            'customer_id': optional,
            'order_id': optional, # Link to existing order (Totem/KDS)
            'discount': {'type': 'NONE', 'value': 0}
        }
        """
        # 1. Validar Sessão de Caixa
        session = CashierSession.query.filter_by(user_id=user_id, status=CashierStatus.OPEN).first()
        if not session:
            raise ValueError("Caixa fechado. Abra o caixa para realizar vendas.")
            
        # 2. Check Order Link
        order_id = data.get('order_id')
        linked_order = None
        if order_id:
            linked_order = Order.query.get(order_id)
            if not linked_order:
                raise ValueError(f"Pedido {order_id} não encontrado.")
            if linked_order.status == OrderStatus.PAID:
                raise ValueError("Pedido já está pago.")
        
        # Check PreOrder Link
        preorder_id = data.get('preorder_id')
        linked_preorder = None
        if preorder_id:
            linked_preorder = PreOrder.query.get(preorder_id)
            if not linked_preorder:
                raise ValueError(f"Encomenda {preorder_id} não encontrada.")
            # Status check if needed, mainly controlled by caller
        
        # 3. Calcular Totais (items logic stays same)
        items_data = data.get('items', [])
        if not items_data:
            raise ValueError("A venda deve conter pelo menos um item.")

        subtotal = 0.0
        sale_items = []

        for item in items_data:
            product = Product.query.get(item['product_id'])
            if not product:
                raise ValueError(f"Produto {item['product_id']} não encontrado.")
            
            qty = float(item['qty'])
            unit_price = float(item['unit_price']) # Poderia pegar do produto, mas front pode mandar (ex: pesável)
            # Validar unit_price com produto? Por enquanto confiamos no front ou validamos margem.
            # Vamos pegar o preço do cadastro se não vier, ou aceitar o do front?
            # Boa prática: Validar se não é muito discrepante ou usar o do banco.
            # No MVP, vamos usar o enviado, mas garantindo que existe.
            if not unit_price: 
                 unit_price = float(product.price)

            line_total = qty * unit_price
            subtotal += line_total
            
            sale_item = SaleItem(
                product_id=product.id,
                qty=qty,
                unit_price=unit_price,
                total_price=line_total,
                notes=item.get('notes')
            )
            sale_items.append(sale_item)
            
            # TODO: Baixa de estoque aqui (se controls_stock=True)

        # 3. Calcular Descontos
        discount_data = data.get('discount', {})
        disc_type_str = discount_data.get('type', 'NONE')
        disc_value = float(discount_data.get('value', 0))
        
        discount_amount = 0.0
        if disc_type_str == 'FIXED':
            discount_amount = disc_value
        elif disc_type_str == 'PERCENT':
            discount_amount = subtotal * (disc_value / 100)
        
        # Garantir não negativo
        total = max(0.0, subtotal - discount_amount)
        
        # 4. Validar Pagamentos
        payments_data = data.get('payments', [])
        total_paid = sum(float(p['amount']) for p in payments_data)
        
        # Se for CASH, o valor pago pode ser maior (troco). Se for cartão, deve bater.
        # No Backend, registramos o valor PAGO REAL (method amount). 
        # O troco é calculado e salvo em change_amount.
        # Regra: Total pago deve cobrir o total da venda.
        if total_paid < (total - 0.01): # tolerância float
            raise ValueError(f"Pagamento insuficiente. Total: {total}, Pago: {total_paid}")

        # 5. Criar Venda
        sale = Sale(
            cashier_user_id=user_id,
            cashier_session_id=session.id,
            customer_id=data.get('customer_id'),
            order_id=order_id, # Link
            preorder_id=preorder_id, # Link PreOrder
            subtotal_value=subtotal,
            discount_type=DiscountType[disc_type_str],
            discount_value=disc_value,
            total_value=total,
            status=SaleStatus.COMPLETED,
            items=sale_items
        )
        db.session.add(sale)
        db.session.flush() # Gerar ID
        
        # Update Linked Order
        if linked_order:
            linked_order.status = OrderStatus.PAID
            db.session.add(linked_order)

        # 6. Criar Pagamentos
        total_change = 0.0
        if total_paid > total:
            total_change = total_paid - total

        # Distribuir o troco no primeiro pagamento em dinheiro? 
        # Ou simplesmente salvar os pagamentos como vieram?
        # Vamos salvar os pagamentos como vieram. O troco fica no registro do pagamento em dinheiro ou separado?
        # O model Payment tem `change_amount`.
        # Vamos atribuir o troco ao pagamento em DINHEIRO se houver.
        
        for p_data in payments_data:
            method = p_data['method']
            amount = float(p_data['amount'])
            
            change = 0.0
            if method == 'CASH' and total_change > 0:
                change = total_change
                total_change = 0 # Consumiu o troco
            
            payment = Payment(
                sale_id=sale.id,
                cashier_session_id=session.id,
                amount=amount,
                method=PaymentMethod[method],
                change_amount=change
            )
            db.session.add(payment)
            
            # Movimentar Caixa (Entrada de dinheiro)
            if method == 'CASH':
                # Entra o valor LIQUIDO (Valor total - troco)? 
                # Não, no caixa físico entra o valor total e sai o troco.
                # Mas o saldo do sistema deve refletir o que ficou na gaveta.
                # No DB CashierSession, current_balance sobe.
                # Se pagou 50 e custou 30 (troco 20), na gaveta ficou +30.
                # Então somamos (amount - change).
                session.current_balance = float(session.current_balance) + (amount - change)
                
                # Opcional: Criar registro em CashMovement? 
                # Em sistema detalhado sim. No MVP, a Session já tem os payments linkados.

        db.session.commit()
        return sale
