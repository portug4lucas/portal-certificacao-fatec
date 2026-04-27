# Portal de Certificação em Metodologias Ágeis
Sistema de autenticação desenvolvido como parte do curso de DSM na FATEC Jacareí (1º semestre — 2026).
Permite cadastro, login e gerenciamento de sessão de usuários via JWT e PostgreSQL.

> ⚠️ Este repositório contém apenas o módulo de autenticação do projeto. 
> O projeto completo está sendo desenvolvido em equipe no repositório [TeamStacked/PortalScrum].

## Tecnologias utilizadas
- Node.js
- Express
- PostgreSQL
- JWT (JSON Web Token)
- bcrypt

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- PostgreSQL instalado e rodando

### Instalação
```bash
npm install
```

### Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:ado |

JWT_ACCESS_SECRET=seu_segredo_aqui
JWT_REFRESH_SECRET=seu_segredo_refresh_aqui
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portal_certificacao
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

### Rodar o servidor
```bash
node server.js
```

## Rotas disponíveis
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/cadastro | Cadastrar novo usuário |
| POST | /auth/login | Fazer login |
| POST | /auth/refresh | Renovar access token |
| POST | /auth/logout | Encerrar sessão |
| GET | /auth/me | Dados do usuário logado |
