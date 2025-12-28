from app import create_app, db
from app.models.auth import Role, User, Permission
from app.utils.security import hash_password

app = create_app()

def seed():
    with app.app_context():
        print("Seeding Roles...")
        roles = [
            ('SUPER_ADMIN', 'Super Administrator - Total Control', True),
            ('ADMIN', 'Manager', False),
            ('CASHIER', 'Cashier', False),
            ('KITCHEN', 'Kitchen Staff', False),
            ('VIEWER', 'Read Only', False)
        ]

        role_objects = {}
        for r_name, r_desc, is_sys in roles:
            role = Role.query.filter_by(name=r_name).first()
            if not role:
                role = Role(name=r_name, description=r_desc, is_system=is_sys)
                db.session.add(role)
            role_objects[r_name] = role
        
        db.session.commit()

        print("Seeding Permissions...")
        # Basic permissions (expand in M4)
        perms = [
            'users:manage', 'roles:manage', 'devices:manage',
            'products:read', 'products:write',
            'orders:read', 'orders:write',
            'reports:view'
        ]
        
        for code in perms:
            p = Permission.query.filter_by(code=code).first()
            if not p:
                p = Permission(code=code, description=f"Permission {code}")
                db.session.add(p)
                # Assign all to SUPER_ADMIN for now
                role_objects['SUPER_ADMIN'].permissions.append(p)
        
        db.session.commit()

        print("Seeding Users...")
        # Check for existing admin
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            print("Creating default admin user...")
            admin_user = User(
                username='admin',
                name='Super Admin',
                password_hash=hash_password('admin123'), # Force change later
                active=True
            )
            db.session.add(admin_user)
        
        # Ensure admin has SUPER_ADMIN role
        if role_objects['SUPER_ADMIN'] not in admin_user.roles:
            admin_user.roles.append(role_objects['SUPER_ADMIN'])
            print("Assigned SUPER_ADMIN role to admin user.")
        
        db.session.commit()
        print("Seed Complete! ✅")

if __name__ == '__main__':
    seed()
