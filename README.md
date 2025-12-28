# Sistema de Loja Integrado (Totem, PDV, Kitchen & Admin)

Monorepo contendo toda a solução para gerenciamento de pedidos de uma lanchonete/restaurante.

## Módulos

1.  **Backend (API)**: Flask + SQLAlchemy + PostgreSQL. Gerencia pedidos, produtos, estoque, caixa e pagamentos.
2.  **Frontend (UI)**: React + Vite + Material UI.
    -   **/totem**: Autoatendimento para clientes.
    -   **/pdv**: Frente de Caixa para operadores.
    -   **/admin**: Gestão de produtos, categorias e dashboard.

## Pré-requisitos

-   Docker e Docker Compose instalados.

## Como Rodar (One Click Run) 🚀

1.  Clone o repositório.
2.  Na raiz do projeto, execute:

```bash
docker-compose up --build
```

3.  Acesse as aplicações:
    -   **Frontend**: http://localhost:5173
    -   **Backend API**: http://localhost:5000

## Credenciais Iniciais

O sistema roda um seed automático na primeira execução criando o usuário admin:

-   **Username**: `admin`
-   **Password**: `admin`

## Fluxo de Uso Recomendado

1.  **Admin**: Acesse `/admin`, faça login e cadastre Categorias e Produtos.
2.  **Totem**: Acesse `/totem` para simular o cliente fazendo pedidos.
3.  **PDV**: Acesse `/pdv` (Login `admin`), abra o caixa e finalize os pedidos que chegam do Totem.
4.  **Dashboard**: Volte ao `/admin` para ver os relatórios de vendas em tempo real.

## Desenvolvimento

Para rodar comandos (instalar deps, migrações) dentro dos containers:

```bash
# Backend Shell
docker-compose exec backend bash

# Frontend Shell
docker-compose exec frontend sh
```
