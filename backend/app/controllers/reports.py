from flask import Blueprint, jsonify, request
from app import db
from app.models.payment import Payment
from app.models.order import Order
from app.models.product import Product
from app.models.order import OrderItem
from app.utils.security import require_auth
from sqlalchemy import func
from datetime import datetime, date

reports_bp = Blueprint('reports', __name__, url_prefix='/api/v1/reports')

@reports_bp.route('/dashboard', methods=['GET'])
@require_auth
def get_dashboard_kpis():
    # Filter for today
    today = date.today()
    
    # Total Sales (Sum of payments made today)
    # Note: Using Payment created_at as reference for cash/sales entry
    total_sales = db.session.query(func.sum(Payment.amount)).filter(
        func.date(Payment.created_at) == today
    ).scalar() or 0.0

    # Total Orders (Count of orders created today)
    total_orders = db.session.query(func.count(Order.id)).filter(
        func.date(Order.created_at) == today
    ).scalar() or 0

    # Average Ticket
    avg_ticket = total_sales / total_orders if total_orders > 0 else 0.0

    return jsonify({
        'today': {
            'total_sales': float(total_sales),
            'total_orders': total_orders,
            'avg_ticket': float(avg_ticket)
        }
    })

@reports_bp.route('/top-products', methods=['GET'])
@require_auth
def get_top_products():
    # Top 5 products by quantity sold (All time for MVP simplicity, or could be today)
    # Let's do All Time for better visualization if today has no data
    results = db.session.query(
        Product.name,
        func.sum(OrderItem.qty).label('total_qty')
    ).join(OrderItem, Product.id == OrderItem.product_id)\
     .group_by(Product.id)\
     .order_by(func.sum(OrderItem.qty).desc())\
     .limit(5).all()

    top_products = [
        {'name': r.name, 'qty': int(r.total_qty)} 
        for r in results
    ]

    return jsonify(top_products)
    return jsonify(top_products)

@reports_bp.route('/sales-history', methods=['GET'])
@require_auth
def get_sales_history():
    from app.models.sale import Sale
    from app.models.auth import User
    from app.models.customer import Customer
    from app.models.order import Order

    # Filters
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    payment_method = request.args.get('payment_method')
    customer_id = request.args.get('customer_id')
    
    query = Sale.query.order_by(Sale.created_at.desc())
    
    if start_date:
        query = query.filter(func.date(Sale.created_at) >= start_date)
    if end_date:
        query = query.filter(func.date(Sale.created_at) <= end_date)
        
    if payment_method:
        # Filter by payment method involves joining with payments
        # This is a bit complex if a sale has multiple payments, but let's assume filtering sales that HAVE this method
        query = query.join(Payment).filter(Payment.method == payment_method)
        
    if customer_id:
        query = query.filter(Sale.customer_id == customer_id)
        
    sales = query.limit(100).all() # Limit for performance
    
    return jsonify([s.to_dict() for s in sales])
