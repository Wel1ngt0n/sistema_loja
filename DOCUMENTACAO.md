# Documentação do Sistema Loja

Esta documentação contém todas as informações necessárias para iniciar, gerenciar e dar manutenção ao Sistema Loja.

## 🚀 Como Iniciar

O projeto foi unificado para ser controlado por um **único script Python**.

### Pré-requisitos
- Python instalado.
- Node.js instalado (apenas para rodar Local).
- Docker instalado (apenas para rodar via Docker).

### Passo a Passo
1. Abra um terminal na pasta raiz do projeto.
2. Execute o comando:
   ```bash
   python sistema.py
   ```
3. Um menu interativo aparecerá com as opções:
   - **[1] Iniciar Sistema (Local)**: Sobe o Backend e Frontend usando terminal local. Ideal para desenvolvimento rápido.
   - **[2] Iniciar Sistema (Docker)**: Sobe tudo via containers Docker. Ideal para simular produção ou ambiente limpo.
   - **[3] Gerenciar Banco de Dados**: Ferramentas para criar tabelas, popular dados (Seed) ou resetar tudo.
   - **[4] Apenas Túnel**: Conecta o sistema local à internet via Cloudflare Tunnel.

---

## 🔑 Credenciais e Acesso

### URLs Padrão
- **Frontend (Loja/Admin)**: `http://localhost:5173`
- **Backend (API)**: `http://localhost:5000`
- **Adminer (Banco GUI)**: `http://localhost:8080` (Apenas no Docker)

### Usuários de Teste (Criados via Seed)
O script de Seed (`python manage.py seed`) cria os seguintes usuários:

| Role | Usuário | Senha | Descrição |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | Acesso total ao sistema. |

### Banco de Dados (PostgreSQL)
- **Hostname**: `localhost` (Local) ou `db` (Docker)
- **Porta**: `5432` (Local) / `5435` (Docker - Acesso Externo no Host)
- **Database**: `loja_db`
- **User**: `user`
- **Password**: `password`

---

## 📁 Estrutura do Projeto

O projeto foi limpo e organizado para manter apenas o essencial.

```
/sistema_loja
├── backend/            # API Python Flask
│   ├── app/            # Código fonte da aplicação
│   ├── manage.py       # Gerenciador de Banco de Dados (Seed/Init)
│   └── run.py          # Ponto de entrada do servidor Python
├── frontend/           # Aplicação React Vite
│   ├── src/            # Código fonte do Frontend
│   └── vite.config.ts  # Configuração única (Docker e Local)
├── sistema.py          # 🤖 SCRIPT PRINCIPAL DE AUTOMAÇÃO
├── docker-compose.yml  # Configuração dos containers
└── DOCUMENTACAO.md     # Este arquivo
```

## 🛠 Manutenção

### Banco de Dados
Para resetar o banco de dados e recriar o usuário admin:
1. Rode `python sistema.py`.
2. Escolha **Opção 3** (Gerenciar Banco).
3. Escolha **Opção 3** (Resetar Completo) e depois **Opção 2** (Popular Dados).

### Acesso Remoto (Mobile)
O sistema usa **Cloudflare Tunnel** para acesso externo sem precisar abrir portas no roteador.
- Ao iniciar o sistema (Opção 1 ou 2), o script pedirá para iniciar o túnel.
- Um link `https://xxxx-xxxx.trycloudflare.com` será exibido.
- Use esse link no celular para acessar a aplicação.

### Notas Técnicas
- **Automação**: Todo script `.ps1` foi removido em favor do `sistema.py`.
- **Configuração Vite**: O arquivo `vite.config.ts` se adapta automaticamente. Se a variável `VITE_API_TARGET` estiver definida (como no Docker), ele aponta para lá. Se não, aponta para `localhost`.
- **Docker**: O banco de dados no docker expõe a porta `5435` para o host para evitar conflitos com instalações locais de Postgres na porta `5432`.
