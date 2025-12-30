from app import create_app, db
from app.models.auth import Role, User, Permission
from app.models import Category, Product, ProductUnit
from app.utils.security import hash_password
import sys

app = create_app()

def init_db():
    """Cria as tabelas do banco de dados (sem apagar dados)."""
    with app.app_context():
        print(">>> Criando tabelas do banco de dados...")
        db.create_all()
        print(">>> Tabelas criadas com sucesso! ✅")

def reset_db():
    """Apaga TODAS as tabelas e recria do zero (CUIDADO)."""
    with app.app_context():
        print(">>> [PERIGO] Apagando todo o banco de dados...")
        db.drop_all()
        print(">>> Recriando tabelas...")
        db.create_all()
        print(">>> Banco de dados resetado com sucesso! ✅")

def seed_db():
    """Popula o banco com dados iniciais (Roles, Admin, Produtos)."""
    with app.app_context():
        print(">>> Iniciando processo de Seed (População de Dados)...")
        
        # 1. Criar Perfis de Acesso (Roles)
        print("- Verificando Perfis (Roles)...")
        roles_data = [
            ('SUPER_ADMIN', 'Super Administrador - Controle Total', True),
            ('ADMIN', 'Gerente', False),
            ('CASHIER', 'Caixa', False),
            ('KITCHEN', 'Cozinha', False),
            ('VIEWER', 'Visualizador', False)
        ]
        
        role_objects = {}
        for r_name, r_desc, is_sys in roles_data:
            role = Role.query.filter_by(name=r_name).first()
            if not role:
                role = Role(name=r_name, description=r_desc, is_system=is_sys)
                db.session.add(role)
            role_objects[r_name] = role
        
        db.session.commit()

        # 2. Criar Permissões Básicas
        print("- Verificando Permissões...")
        perms = [
            'users:manage', 'roles:manage', 'devices:manage',
            'products:read', 'products:write',
            'orders:read', 'orders:write',
            'reports:view'
        ]
        
        for code in perms:
            p = Permission.query.filter_by(code=code).first()
            if not p:
                p = Permission(code=code, description=f"Permissão {code}")
                db.session.add(p)
                # Atribui tudo ao Super Admin
                if p not in role_objects['SUPER_ADMIN'].permissions:
                    role_objects['SUPER_ADMIN'].permissions.append(p)
        
        db.session.commit()

        # 3. Criar Usuário Admin
        print("- Verificando Usuário Admin...")
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            print("  > Criando usuário 'admin' padrão...")
            admin_user = User(
                username='admin',
                name='Super Administrador',
                password_hash=hash_password('admin123'), # Trocar em produção
                active=True
            )
            db.session.add(admin_user)
        
        # Garantir role de Super Admin
        if role_objects['SUPER_ADMIN'] not in admin_user.roles:
            admin_user.roles.append(role_objects['SUPER_ADMIN'])
            print("  > Role SUPER_ADMIN atribuída ao admin.")

        # 4. Dados de Exemplo (Categorias e Produtos)
        print("- Verificando Dados de Produtos...")
        if not Category.query.first():
            print("  > Inserindo categorias e produtos de exemplo...")
            cat_carnes = Category(name="Carnes Assadas", sort_order=1)
            cat_marmitas = Category(name="Marmitas", sort_order=2)
            cat_bebidas = Category(name="Bebidas", sort_order=3)
            
            db.session.add_all([cat_carnes, cat_marmitas, cat_bebidas])
            db.session.commit() # Commit para gerar IDs

            # Produtos Exemplo
            p1 = Product(name="Marmita Tradicional", category_id=cat_marmitas.id, price=25.00, description="Arroz, feijão, carne e salada")
            p2 = Product(name="Frango Assado (Inteiro)", category_id=cat_carnes.id, price=45.00, unit=ProductUnit.UN, controls_stock=True, stock_qty=10)
            p3 = Product(name="Coca Cola 350ml", category_id=cat_bebidas.id, price=5.00, controls_stock=True, stock_qty=50)

            db.session.add_all([p1, p2, p3])
        
        db.session.commit()
        print(">>> Seed concluído com sucesso! ✅")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == 'init':
            init_db()
        elif cmd == 'seed':
            seed_db()
        elif cmd == 'reset':
            reset_db()
        else:
            print("Comando desconhecido. Use: init, seed, reset")
    else:
        print("Uso: python manage.py [init|seed|reset]")
