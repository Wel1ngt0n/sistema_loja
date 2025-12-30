import subprocess
import time
import os
import sys

# Configuração de cores para o terminal
os.system('color') 

def run_in_new_terminal(command, title="Terminal"):
    """Abre um novo terminal e executa o comando (Windows)."""
    full_cmd = f'start "{title}" cmd /k "{command}"'
    subprocess.Popen(full_cmd, shell=True)

def run_command(command, cwd=None, shell=True):
    try:
        subprocess.run(command, cwd=cwd, shell=shell, check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def menu_database():
    while True:
        print("\n=== GERENCIAR BANCO DE DADOS (VIA DOCKER) ===")
        print("1. Criar Tabelas (Init) - Cria se não existirem")
        print("2. Popular Dados (Seed) - Cria admin e produtos exemplo")
        print("3. RESETAR TUDO (Reset) - Apaga e recria do zero")
        print("0. Voltar")
        
        opt = input("Escolha: ").strip()
        
        cmd_prefix = "docker-compose exec -T backend python manage.py"
        
        if opt == '1':
            print("Executando Init...")
            run_command(f"{cmd_prefix} init")
        elif opt == '2':
            print("Executando Seed...")
            run_command(f"{cmd_prefix} seed")
        elif opt == '3':
            confirm = input("TEM CERTEZA? ISSO APARÁ TUDO! (s/n): ").lower()
            if confirm == 's':
                print("Executando Reset...")
                run_command(f"{cmd_prefix} reset")
        elif opt == '0':
            break
        else:
            print("Opção inválida.") 

def backup_restore_menu():
    while True:
        print("\n=== BACKUP & MIGRAÇÃO (Requer Docker ON) ===")
        print("1. FAZER Backup (Salvar dados em arquivo)")
        print("2. RESTAURAR Backup (Carregar dados de arquivo)")
        print("0. Voltar")
        
        opt = input("Escolha: ").strip()
        
        db_container = "sistema_loja-db-1" # Nome padrão do container do banco
        backup_file = "backup_loja.sql"
        
        if opt == '1':
            print(f"\nGerando backup em '{backup_file}'...")
            try:
                # O comando pg_dump roda dentro do container e o output é redirecionado para arquivo local
                # -i: interactive (sem tty)
                # -e PGPASSWORD=...: define senha para não pedir prompt
                cmd = f"docker exec -i -e PGPASSWORD=password {db_container} pg_dump -U user -d loja_db --clean --if-exists"
                
                with open(backup_file, "w") as outfile:
                    subprocess.run(cmd, stdout=outfile, shell=True, check=True)
                
                print(f"✔ Sucesso! Arquivo '{backup_file}' criado.")
                print("Guarde este arquivo para levar para outra máquina.")
            except Exception as e:
                print(f"❌ Erro ao criar backup: {e}")
                
        elif opt == '2':
            if not os.path.exists(backup_file):
                print(f"❌ Arquivo '{backup_file}' não encontrado nesta pasta.")
                continue
                
            confirm = input(f"TEM CERTEZA? Isso vai substituir os dados atuais pelos do '{backup_file}'! (s/n): ").lower()
            if confirm == 's':
                print("Restaurando dados...")
                try:
                    # Lê o arquivo local e envia para o psql dentro do container
                    cmd = f"docker exec -i -e PGPASSWORD=password {db_container} psql -U user -d loja_db"
                    
                    with open(backup_file, "r") as infile:
                        subprocess.run(cmd, stdin=infile, shell=True, check=True)
                        
                    print("✔ Sucesso! Dados restaurados.")
                except Exception as e:
                    print(f"❌ Erro ao restaurar: {e}")
                    
        elif opt == '0':
            break

def main_menu():
    while True:
        print("\n==========================================")
        print("         SISTEMA LOJA - MENU PRINCIPAL    ")
        print("==========================================")
        print("1. Iniciar Sistema (Local)  - Abre terminais para Front e Back")
        print("2. Iniciar Sistema (Docker) - Roda tudo em containers (Recomendado)")
        print("3. Gerenciar Banco de Dados - Init, Seed, Reset")
        print("4. Backup & Migração        - Salvar ou Restaurar Dados")
        print("5. Apenas Túnel (Aleatório) - Link temporário Cloudflare")
        print("6. Apenas Túnel (FIXO)      - Link 'comanda360.online'")
        print("0. Sair")
        print("==========================================")
        
        choice = input("Escolha uma opção: ").strip()
        
        if choice == '1':
            print("\nIniciando Backend em nova janela...")
            # backend/run.py
            run_in_new_terminal("python backend/run.py", "Backend Server")
            
            print("Iniciando Frontend em nova janela...")
            # frontend npm run dev
            run_in_new_terminal("cd frontend && npm run dev", "Frontend Server")
            
            print("\nComandos enviados! Verifique as novas janelas.")
            input("Pressione Enter para voltar ao menu...")

        elif choice == '2':
            print("\nSubindo Docker Compose...")
            if run_command("docker-compose up -d --build"):
                print("\n✔ Containers Online!")
                print("Frontend: http://localhost:5173")
                print("Backend:  http://localhost:5000")
            else:
                print("\n❌ Erro ao subir containers.")
            input("Pressione Enter para voltar ao menu...")

        elif choice == '3':
            menu_database()

        elif choice == '4':
            backup_restore_menu()

        elif choice == '5':
            print("\nIniciando Túnel Cloudflare (Aleatório)...")
            print("Certifique-se que o sistema já está rodando.")
            try:
                subprocess.run("cloudflared.exe tunnel --url http://localhost:80", shell=True)
            except KeyboardInterrupt:
                print("\nTúnel encerrado.")

        elif choice == '6':
            print("\nIniciando Túnel Cloudflare (Fixo - comanda360.online)...")
            if not os.path.exists("cloudflared_config.yml"):
                print("❌ Configuração não encontrada. Configure primeiro.")
            else:
                try:
                    subprocess.run("cloudflared.exe tunnel --config cloudflared_config.yml run loja", shell=True)
                except KeyboardInterrupt:
                    print("\nTúnel encerrado.")

        elif choice == '0':
            print("Saindo...")
            sys.exit(0)
            
        else:
            print("Opção inválida.")

if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\nSaindo...")
