from app import create_app
from app.extensions import db
from app.models.pre_order import PreOrder
from app.models.pre_order_item import PreOrderItem

app = create_app()

with app.app_context():
    print("Creating database tables...")
    db.create_all()
    print("Tables created successfully.")
