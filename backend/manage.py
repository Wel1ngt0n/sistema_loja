from app import create_app, db
from app.models import User, UserRole, Category, Product, ProductUnit
from app.utils.security import hash_password
import sys

app = create_app()

def init_db():
    with app.app_context():
        print("Criando tabelas...")
        db.create_all()
        print("Tabelas criadas com sucesso.")

def seed_db():
    with app.app_context():
        print("Seeding database...")
        
        # Verificar se já existe admin
        if User.query.filter_by(username='admin').first():
            print("Admin já existe.")
        else:
            admin = User(
                name="Administrador",
                username="admin",
                password_hash=hash_password("admin"),
                role=UserRole.ADMIN
            )
            db.session.add(admin)
            print("Admin criado: admin / admin123")

        # Categorias Iniciais
        if not Category.query.first():
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
            print("Dados iniciais inseridos.")
        
        db.session.commit()
        print("Seed concluído.")

def reset_db():
    with app.app_context():
        print("Apagando banco de dados...")
        db.drop_all()
        print("Recriando tabelas...")
        db.create_all()
        print("Banco de dados resetado com sucesso.")

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
            print("Comando inválido. Use 'init', 'seed' ou 'reset'.")
    else:
        print("Use 'python manage.py [init|seed|reset]'")
