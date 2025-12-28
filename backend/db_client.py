import sys
import os
from sqlalchemy import create_engine, text
import pandas as pd

# Configuração de Conexão
# Tenta pegar do ambiente ou usa o default desenvolvimento
DB_URI = os.environ.get('DATABASE_URL') or 'postgresql://user:password@localhost:5432/loja_db'

def list_tables(engine):
    query = text("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    with engine.connect() as conn:
        result = conn.execute(query)
        tables = [row[0] for row in result]
        print("\n--- Tabelas no Banco de Dados ---")
        for t in tables:
            print(f"- {t}")
        return tables

def run_query(engine, sql):
    try:
        with engine.connect() as conn:
            # Se for SELECT, usa pandas para formatar bonito
            if sql.strip().upper().startswith("SELECT"):
                df = pd.read_sql(sql, conn)
                if df.empty:
                    print("\n[Resultado Vazio]")
                else:
                    print(f"\n--- Resultado ({len(df)} linhas) ---")
                    print(df.to_string(index=False))
            else:
                conn.execute(text(sql))
                conn.commit()
                print("\n[Comando executado com sucesso]")
    except Exception as e:
        print(f"\n[ERRO]: {e}")

def main():
    try:
        print(f"Conectando em: {DB_URI}")
        engine = create_engine(DB_URI)
        
        # Test connection
        with engine.connect() as conn:
            pass
        print("Conexão OK!")

        if len(sys.argv) > 1:
            # Modo comando direto: python db_client.py "SELECT * FROM users"
            sql = sys.argv[1]
            if sql == "list":
                list_tables(engine)
            else:
                run_query(engine, sql)
        else:
            # Modo Interativo
            print("\nBem-vindo ao DB Client Rápido!")
            print("Digite SQL ou 'list' para ver tabelas. 'exit' para sair.")
            
            while True:
                user_input = input("\nDB > ").strip()
                if user_input.lower() in ['exit', 'quit']:
                    break
                if user_input.lower() == 'list':
                    list_tables(engine)
                elif user_input:
                    run_query(engine, user_input)

    except Exception as e:
        print(f"Erro fatal: {e}")
        print("Verifique se o container/banco esta rodando e as credenciais.")

if __name__ == "__main__":
    main()
