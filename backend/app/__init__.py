from flask import Flask
from .config import config
from .extensions import socketio, bcrypt, db, migrate

# Removed db = SQLAlchemy() from here

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    db.init_app(app)
    bcrypt.init_app(app)
    socketio.init_app(app)
    migrate.init_app(app, db)

    from .controllers.auth import auth_bp
    from .controllers.category import category_bp
    from .controllers.product import product_bp
    from .controllers.order import order_bp
    from .controllers.cashier import cashier_bp
    from .controllers.payment import payment_bp
    from .controllers.reports import reports_bp
    from .controllers.uploads import uploads_bp
    from .controllers.super_admin import super_admin_bp
    from .controllers.sales import sales_bp
    from .controllers.totem import totem_bp
    from .controllers.pre_order import pre_order_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(cashier_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(uploads_bp)
    app.register_blueprint(super_admin_bp)
    app.register_blueprint(sales_bp)
    app.register_blueprint(totem_bp)
    app.register_blueprint(pre_order_bp)

    from .controllers.customer import customer_bp
    app.register_blueprint(customer_bp)

    # Import models here to register with SQLAlchemy for migrations
    with app.app_context():
        from .models import category, product, order, auth, cashier, payment, sale, customer, settings, audit_log

    @app.route('/health')
    def health():
        return jsonify({"status": "ok"}), 200

    return app
