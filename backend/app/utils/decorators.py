from functools import wraps
from flask import request, g
from app.extensions import db
from app.models.audit_log import AuditLog
import json

def audit_log(action, resource=None):
    """
    Decorator para registrar logs de auditoria automáticos.
    Uso: @audit_log(action="UPDATE_PRICE", resource="PRODUCT")
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Executa a função original
            response = f(*args, **kwargs)
            
            # Pega o status da resposta
            status_code = 200
            if hasattr(response, 'status_code'):
                status_code = response.status_code
            elif isinstance(response, tuple):
                status_code = response[1]
                
            # Só loga se foi sucesso (ou podemos logar falhas também, mas MVP logamos sucessos críticos)
            if 200 <= status_code < 300:
                try:
                    # Tenta extrair ID do resource se possível (kwargs ou response json)
                    res_id = kwargs.get('id')
                    
                    # Detalhes: Payload da requisição (se POST/PUT)
                    details = None
                    if request.method in ['POST', 'PUT', 'PATCH']:
                        try:
                            if request.is_json:
                                details = request.get_json()
                        except:
                            pass
                            
                    log = AuditLog(
                        user_id=g.user.id if hasattr(g, 'user') else None,
                        action=action,
                        resource=resource,
                        resource_id=str(res_id) if res_id else None,
                        details=details,
                        ip_address=request.remote_addr
                    )
                    db.session.add(log)
                    db.session.commit()
                except Exception as e:
                    print(f"Erro ao salvar audit log: {e}")
                    # Não impede o fluxo principal
                    db.session.rollback()
            
            return response
        return decorated_function
    return decorator
