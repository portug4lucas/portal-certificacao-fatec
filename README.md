# Portal de Certificação em Metodologias Ágeis

Sistema de autenticação desenvolvido como parte do curso de DSM na FATEC Jacareí (1º semestre — 2026).

Permite cadastro, login e gerenciamento de sessão de usuários via JWT e PostgreSQL.

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

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

### Rodar o servidor

```bash
node server.js
```

## Rotas disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/cadastro | Cadastrar novo usuário |
| POST | /auth/login | Fazer login e receber token |
| POST | /auth/refresh | Renovar token de acesso |
| POST | /auth/logout | Encerrar sessão |
| GET | /auth/me | Retornar dados do usuário logado |
