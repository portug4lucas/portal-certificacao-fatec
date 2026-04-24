# Portal de Certificação em Metodologias Ágeis
FATEC Jacareí — 1º DSM — 2026

## Como rodar o projeto

### Pré-requisitos
- Node.js
- PostgreSQL

### Instalação
```bash
npm install
```

### Configurar o .env

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portal_certificacao
DB_USER=postgres
DB_PASSWORD=...

### Rodar o servidor
```bash
node server.js
```

## Rotas disponíveis
- POST /auth/cadastro — cadastrar usuário
- POST /auth/login — fazer login
- POST /auth/refresh — renovar token
- POST /auth/logout — sair
- GET /auth/me — dados do usuário logado
