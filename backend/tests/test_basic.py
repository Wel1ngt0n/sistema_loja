import json
from app.models.user import User, UserRole

def test_health(client):
    res = client.get('/health')
    assert res.status_code == 200
    assert res.json['status'] == 'ok'

def test_create_user(app):
    with app.app_context():
        user = User(name="Test", username="test", password_hash="hash", role=UserRole.ADMIN)
        from app import db
        db.session.add(user)
        db.session.commit()
        
        saved = User.query.first()
        assert saved.username == "test"
        assert saved.role == UserRole.ADMIN

def test_login_flow(client, app):
    # Criar user
    from app.utils.security import hash_password
    with app.app_context():
        from app import db
        u = User(name="Admin", username="admin", password_hash=hash_password("123456"), role=UserRole.ADMIN)
        db.session.add(u)
        db.session.commit()

    # Login errado
    res = client.post('/api/v1/auth/login', json={'username':'admin', 'password':'wrong'})
    assert res.status_code == 401

    # Login certo
    res = client.post('/api/v1/auth/login', json={'username':'admin', 'password':'123456'})
    assert res.status_code == 200
    token = res.json['token']
    assert token is not None

    # Acesso protegido
    res = client.get('/api/v1/admin/categories', headers={'Authorization': f'Bearer {token}'})
    assert res.status_code == 200 # Empty list
