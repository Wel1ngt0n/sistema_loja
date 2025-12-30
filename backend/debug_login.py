from app import create_app
from app.models.auth import User
from app.utils.security import check_password, hash_password

app = create_app()
with app.app_context():
    print("--- DEBUG LOGIN START ---")
    user = User.query.filter_by(username='admin').first()
    if not user:
        print("User 'admin' NOT FOUND!")
    else:
        print(f"User found: {user.username}")
        print(f"Hash: {user.password_hash}")
        
        is_valid = check_password('admin123', user.password_hash)
        print(f"Password 'admin123' valid? {is_valid}")
        
        if not is_valid:
            print("Trying to reset password to 'admin123'...")
            user.password_hash = hash_password('admin123')
            from app.extensions import db
            db.session.commit()
            print("Password reset. Testing again...")
            print(f"Valid now? {check_password('admin123', user.password_hash)}")

    print("--- DEBUG LOGIN END ---")
