from app import db
from app.models.cashier import CashierSession, CashierStatus, CashMovement, MovementType
from datetime import datetime

class CashierService:
    @staticmethod
    def get_open_session(user_id):
        return CashierSession.query.filter_by(
            user_id=user_id, 
            status=CashierStatus.OPEN
        ).first()

    @staticmethod
    def open_session(user_id, start_balance):
        if CashierService.get_open_session(user_id):
            raise ValueError("Usuário já possui um caixa aberto.")
        
        session = CashierSession(
            user_id=user_id,
            start_balance=start_balance,
            current_balance=start_balance,
            status=CashierStatus.OPEN
        )
        db.session.add(session)
        db.session.commit()
        return session

    @staticmethod
    def close_session(user_id, end_balance):
        session = CashierService.get_open_session(user_id)
        if not session:
            raise ValueError("Nenhum caixa aberto encontrado.")
        
        session.end_balance = end_balance
        session.closed_at = datetime.utcnow()
        session.status = CashierStatus.CLOSED
        
        db.session.commit()
        return session

    @staticmethod
    def add_movement(user_id, type_str, amount, reason):
        session = CashierService.get_open_session(user_id)
        if not session:
            raise ValueError("Caixa fechado. Não é possível realizar movimentações.")
            
        try:
            m_type = MovementType(type_str)
        except ValueError:
            raise ValueError(f"Tipo de movimento inválido: {type_str}")
            
        amount = float(amount)
        if amount <= 0:
            raise ValueError("Valor deve ser positivo.")
            
        # Create Movement
        movement = CashMovement(
            session_id=session.id,
            type=m_type,
            amount=amount,
            reason=reason,
            created_by=user_id
        )
        
        # Update Balance
        if m_type == MovementType.SUPPLY:
            session.current_balance = float(session.current_balance) + amount
        elif m_type == MovementType.WITHDRAW:
            if float(session.current_balance) < amount:
                 # Optional: Allow negative balance or block? Usually block or warn.
                 # Allowing for FLEXIBILITY, but logically it reduces cash.
                 pass 
            session.current_balance = float(session.current_balance) - amount
            
        db.session.add(movement)
        db.session.commit()
        return movement
