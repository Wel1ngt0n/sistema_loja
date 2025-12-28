from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from app.models.product import Product
from app.extensions import db
from app.utils.security import require_permission, require_auth
from app.utils.decorators import audit_log
import csv
import io
import os
import uuid
import urllib.request
import threading
from flask import current_app
from app.models.category import Category

# In-memory job store: { job_id: { status: 'processing', current: 0, total: 0, result: None, error: None } }
IMPORT_JOBS = {}

product_bp = Blueprint('products', __name__, url_prefix='/api/v1')

@product_bp.route('/products', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    search = request.args.get('search', '')
    category_id = request.args.get('category_id', type=int)
    
    query = Product.query
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
    if category_id:
        query = query.filter_by(category_id=category_id)
        
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'items': [p.to_dict() for p in pagination.items]
    })

@product_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

@product_bp.route('/products', methods=['POST'])
@require_auth
@require_permission('products:write')
@audit_log(action="CREATE_PRODUCT", resource="PRODUCT")
def create_product():
    data = request.get_json()
    try:
        prod = Product(
            name=data['name'],
            barcode=data.get('barcode'),
            price=data['price'],
            category_id=data['category_id'],
            description=data.get('description'),
            image_url=data.get('image_url'),
            unit=data.get('unit', 'UN'),
            is_kit=data.get('is_kit', False),
            kit_options=data.get('kit_options'),
            featured=data.get('featured', False),
            upsell=data.get('upsell', False)
        )
        db.session.add(prod)
        db.session.commit()
        return jsonify(prod.to_dict()), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@product_bp.route('/products/<int:id>', methods=['PUT'])
@require_auth
@require_permission('products:write')
@audit_log(action="UPDATE_PRODUCT", resource="PRODUCT")
def update_product(id):
    prod = Product.query.get_or_404(id)
    data = request.get_json()
    
    prod.name = data.get('name', prod.name)
    prod.barcode = data.get('barcode', prod.barcode)
    prod.price = data.get('price', prod.price)
    prod.category_id = data.get('category_id', prod.category_id)
    prod.description = data.get('description', prod.description)
    prod.image_url = data.get('image_url', prod.image_url)
    prod.unit = data.get('unit', prod.unit)
    prod.is_kit = data.get('is_kit', prod.is_kit)
    prod.kit_options = data.get('kit_options', prod.kit_options)
    prod.featured = data.get('featured', prod.featured)
    prod.upsell = data.get('upsell', prod.upsell)
    
    db.session.commit()
    return jsonify(prod.to_dict())

@product_bp.route('/products/<int:id>', methods=['DELETE'])
@require_auth
@require_permission('products:write') # or products:delete
@audit_log(action="DELETE_PRODUCT", resource="PRODUCT")
def delete_product(id):
    prod = Product.query.get_or_404(id)
    try:
        db.session.delete(prod)
        db.session.commit()
        return jsonify({'message': 'Product deleted'})
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'error': 'PRODUCT_IN_USE',
            'message': 'Este produto possui histórico de vendas ou pedidos e não pode ser excluído permanentemente.'
        }), 409

@product_bp.route('/products/export/csv', methods=['GET'])
def export_products_csv():
    # Helper to clean description for CSV
    def clean_text(text):
        if not text: return ""
        return text.replace('\n', ' ').replace('\r', '')

    products = Product.query.order_by(Product.id.asc()).all()
    
    # Create an in-memory output file
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(['id', 'barcode', 'name', 'price', 'category_id', 'category_name', 'unit', 'active', 'stock_qty', 'image_url', 'description'])
    
    for p in products:
        writer.writerow([
            p.id,
            p.barcode or '',
            p.name,
            p.price,
            p.category_id,
            p.category.name if p.category else 'Sem Categoria',
            p.unit.name if hasattr(p.unit, 'name') else str(p.unit), # Handle Enum
            '1' if p.active else '0',
            p.stock_qty,
            p.image_url or '',
            clean_text(p.description)
        ])
        
    output.seek(0)
    
    from flask import Response
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=produtos.csv"}
    )

def process_import_job(app, job_id, file_content):
    with app.app_context():
        try:
            stream = io.StringIO(file_content, newline=None)
            try:
                dialect = csv.Sniffer().sniff(file_content[:1024])
                csv_reader = csv.DictReader(stream, dialect=dialect)
            except:
                stream.seek(0)
                csv_reader = csv.DictReader(stream)

            # Convert to list to count total and process
            rows = list(csv_reader)
            total_rows = len(rows)
            IMPORT_JOBS[job_id]['total'] = total_rows
            
            created_count = 0
            updated_count = 0
            errors = []
            
            for index, row in enumerate(rows):
                # Update progress
                IMPORT_JOBS[job_id]['current'] = index + 1
                
                try:
                    # Basic validation
                    if not row.get('name') or not row.get('price') or not row.get('category_id'):
                        continue
                        
                    prod_id = row.get('id')
                    cat_id = int(row.get('category_id'))
                    
                    # Verify category exists
                    category_exists = db.session.query(Category.id).filter_by(id=cat_id).first()
                    if not category_exists:
                        errors.append(f"Categoria {cat_id} não encontrada para produto {row.get('name')}")
                        continue

                    # Image Download Logic
                    image_url = row.get('image_url')
                    if image_url and image_url.startswith(('http://', 'https://')):
                        try:
                            # Create a request object
                            req = urllib.request.Request(
                                image_url, 
                                data=None, 
                                headers={'User-Agent': 'Mozilla/5.0'}
                            )
                            with urllib.request.urlopen(req, timeout=10) as response:
                                if response.status == 200:
                                    # Guess extension
                                    content_type = response.headers.get('Content-Type', '')
                                    ext = 'jpg'
                                    if 'png' in content_type: ext = 'png'
                                    elif 'jpeg' in content_type: ext = 'jpg'
                                    elif 'webp' in content_type: ext = 'webp'
                                    elif 'gif' in content_type: ext = 'gif'
                                    
                                    filename = f"{uuid.uuid4().hex}.{ext}"
                                    upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
                                    if not os.path.exists(upload_folder):
                                        os.makedirs(upload_folder)
                                        
                                    file_path = os.path.join(upload_folder, filename)
                                    with open(file_path, 'wb') as f:
                                        f.write(response.read())
                                        
                                    image_url = f"http://localhost:5000/static/uploads/{filename}"
                        except Exception as img_err:
                            errors.append(f"Erro ao baixar imagem do produto {row.get('name')}: {str(img_err)}")
                            pass

                    if prod_id and prod_id.strip():
                        # Update
                        prod = Product.query.get(int(prod_id))
                        if prod:
                            prod.name = row['name']
                            prod.barcode = row.get('barcode')
                            prod.price = float(row['price'].replace(',', '.'))
                            prod.category_id = cat_id
                            prod.unit = row.get('unit', 'UN')
                            prod.active = row.get('active') == '1' or row.get('active') == 'True'
                            prod.stock_qty = int(float(row.get('stock_qty', '0').replace(',', '.')))
                            prod.description = row.get('description', '')
                            if image_url:
                                prod.image_url = image_url
                            updated_count += 1
                        else:
                            # Treating as NEW if ID not found? Or skip?
                            # Strategy: Create new
                            prod = Product(
                                name=row['name'],
                                barcode=row.get('barcode'),
                                price=float(row['price'].replace(',', '.')),
                                category_id=cat_id,
                                unit=row.get('unit', 'UN'),
                                active=row.get('active') == '1' or row.get('active') == 'True',
                                stock_qty=int(float(row.get('stock_qty', '0').replace(',', '.'))),
                                description=row.get('description', ''),
                                image_url=image_url
                            )
                            db.session.add(prod)
                            created_count += 1
                    else:
                        # Create New
                        prod = Product(
                            name=row['name'],
                            barcode=row.get('barcode'),
                            price=float(row['price'].replace(',', '.')),
                            category_id=cat_id,
                            unit=row.get('unit', 'UN'),
                            active=row.get('active') == '1' or row.get('active') == 'True',
                            stock_qty=int(float(row.get('stock_qty', '0').replace(',', '.'))),
                            description=row.get('description', ''),
                            image_url=image_url
                        )
                        db.session.add(prod)
                        created_count += 1
                        
                except Exception as row_error:
                    errors.append(f"Erro na linha {row.get('name', 'UNKNOWN')}: {str(row_error)}")
            
            db.session.commit()
            
            IMPORT_JOBS[job_id]['status'] = 'completed'
            IMPORT_JOBS[job_id]['result'] = {
                'created': created_count,
                'updated': updated_count,
                'errors': errors
            }
            
        except Exception as e:
            IMPORT_JOBS[job_id]['status'] = 'failed'
            IMPORT_JOBS[job_id]['error'] = str(e)

@product_bp.route('/products/import/csv', methods=['POST'])
@require_auth
@require_permission('products:write')
@audit_log(action="IMPORT_PRODUCTS_CSV", resource="PRODUCT")
def import_products_csv():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    try:
        # Read content to memory
        file_content = file.stream.read().decode("UTF8")
        
        job_id = uuid.uuid4().hex
        IMPORT_JOBS[job_id] = {
            'status': 'processing',
            'current': 0,
            'total': 0,
            'result': None,
            'error': None
        }
        
        # Start background thread
        thread = threading.Thread(target=process_import_job, args=(current_app._get_current_object(), job_id, file_content))
        thread.start()
        
        return jsonify({'jobId': job_id}), 202
        
    except Exception as e:
        return jsonify({'message': f'Erro ao iniciar importação: {str(e)}'}), 400

@product_bp.route('/products/import/status/<job_id>', methods=['GET'])
@require_auth
def get_import_status(job_id):
    job = IMPORT_JOBS.get(job_id)
    if not job:
        return jsonify({'message': 'Job not found'}), 404
        
    return jsonify(job)
