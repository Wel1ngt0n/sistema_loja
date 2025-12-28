import os
from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.utils import secure_filename
from app.utils.security import require_auth
import uuid

uploads_bp = Blueprint('uploads', __name__, url_prefix='/api/v1/uploads')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

from PIL import Image
import io

# ...

@uploads_bp.route('/', methods=['POST'])
@require_auth
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        # 1. Check File Size (Max 5MB)
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        file.seek(0)
        
        if file_length > 5 * 1024 * 1024:
            return jsonify({'message': 'Arquivo muito grande. Máximo aceito é 5MB.'}), 400

        # 2. Check Valid Image (but no strict dimensions)
        try:
            img = Image.open(file)
            img.verify() # Verify it's an image
            
            # Reset file pointer after reading with PIL
            file.seek(0)
            
        except Exception as e:
            return jsonify({'message': 'Arquivo inválido ou corrompido.'}), 400

        # Generate safe unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        
        # Save path
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file.save(os.path.join(upload_folder, filename))
        
        # Public URL
        # Hardcoded to localhost:5000 for Docker dev environment to ensure browser access
        file_url = f'http://localhost:5000/static/uploads/{filename}'
        
        return jsonify({
            'url': file_url,
            'filename': filename
        }), 201
        
    return jsonify({'message': 'File type not allowed'}), 400
