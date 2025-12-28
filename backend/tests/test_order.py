import pytest
from app.models.order import Order
from app.services.order_service import OrderService

def test_create_order_totem(client, app):
    # Setup: Create product
    with app.app_context():
        from app.models.product import Product
        from app.models.category import Category
        from app import db
        
        cat = Category(name="Lanches", sort_order=1, active=True)
        db.session.add(cat)
        db.session.commit()
        
        prod = Product(name="X-Salada", price=20.0, category_id=cat.id, active=True, available_in_totem=True)
        db.session.add(prod)
        db.session.commit()
        prod_id = prod.id

    # Test: Create Order Endpoint
    payload = {
        "origin": "TOTEM",
        "items": [
            {"product_id": prod_id, "qty": 1, "notes": "Sem cebola"},
            {"product_id": prod_id, "qty": 2}
        ]
    }
    
    response = client.post('/api/v1/orders', json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data['order_number'] is not None
    assert len(data['items']) == 2
    assert data['items'][0]['notes'] == "Sem cebola"
    
    # Verify OrderService/DB
    with app.app_context():
        order = Order.query.get(data['id'])
        assert order is not None
        assert order.origin.value == "TOTEM"
        assert len(order.items) == 2
