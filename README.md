# Documentação do Backend

> **Projeto:** Portaria  
> **Versão:** 1.0.0  
> **Autor:** OA  
> **Descrição:** Sistema para registro de acessos a empresa

---

## 📌 Visão Geral

Este documento descreve a arquitetura, padrões, tecnologias e funcionamento do backend do projeto **Portaria**.  
O objetivo é servir como guia para desenvolvimento, manutenção e evolução do sistema.

---

## 🎯 Objetivo do Sistema

- Registrar informações pertinentes ao acesso de usuários externos e associados a empresa
- Manter o controle de tempo de permanência dos usuários
- Este sistema é de uso exclusivo da recepção da empresa

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- TypeScript
- Vite
- Framework HTTP: Fastify
- Banco de Dados: PostgreSQL
- ORM / Client: TypeORM
- Autenticação: JWT
- Validação de dados: Zod

---

## 🧱 Arquitetura do Sistema

O backend segue uma arquitetura em camadas, separando responsabilidades para facilitar manutenção e escalabilidade.

### Camadas

- **Routes**: Definição das rotas HTTP
- **Controllers**: Entrada das requisições e respostas
- **Services**: Regras de negócio
- **Repositories**: Acesso a dados
- **Middlewares**: Autenticação, validações e interceptações

---

## 📁 Estrutura de Pastas

```txt
src/
 ├── assets/
 │         ├── *.png
 ├── modules/
 │    └── example/
 │         ├── example.controller.ts
 │         ├── example.service.ts
 │         ├── example.repository.ts
 │         └── example.routes.ts
 ├── shared/
 │    ├── middlewares/
 │    ├── errors/
 │    └── utils/
 ├── App.css
 ├── App.tsx
 ├── index.tsx
 └── main.tsx
```

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js >= 18
- npm ou yarn

### Variáveis de Ambiente

```env
PORT=5173
DATABASE_URL=
JWT_SECRET=
```

> ⚠️ Nunca versionar o arquivo `.env`

---

## ▶️ Como Executar o Projeto

```bash
npm install
npm run dev
```

### Scripts

- `dev` → Ambiente de desenvolvimento
- `build` → Build de produção
- `start` → Executa o projeto compilado

---

## 🔐 Autenticação e Autorização

O sistema utiliza autenticação baseada em **JWT (JSON Web Token)**.

### Fluxo de Autenticação

1. Usuário envia credenciais
2. Backend valida os dados
3. Token JWT é gerado
4. Token deve ser enviado nas requisições protegidas

```http
Authorization: Bearer {token}
```

---

## 🌐 Endpoints da API

### 🔑 Autenticação

#### POST /auth/login

**Descrição:** Autentica um usuário no sistema.

**Body:**
```json
{
  "email": "user@email.com",
  "password": "123456"
}
```

**Resposta 200:**
```json
{
  "token": "jwt_token"
}
```

---

### 👤 Usuários

#### GET /users

**Descrição:** Lista todos os usuários.

**Headers:**
```http
Authorization: Bearer token
```

---

## 📜 Regras de Negócio

- Usuários devem possuir e-mail único
- Apenas usuários autorizados acessam rotas protegidas
- Exclusões podem ser lógicas (soft delete)

---

## ❌ Tratamento de Erros

### Padrão de Resposta

```json
{
  "message": "Descrição do erro",
  "code": "ERROR_CODE"
}
```

### Códigos HTTP Utilizados

- 400 → Requisição inválida
- 401 → Não autorizado
- 403 → Proibido
- 404 → Não encontrado
- 500 → Erro interno do servidor

---

## 🧪 Testes

- Testes unitários
- Testes de integração

(Ferramentas: Jest / Vitest)

---

## 📊 Logs e Monitoramento

- Logs de erro
- Logs de requisição
- Logs de autenticação

---

## 🚀 Roadmap

- [ ] Implementar testes automatizados
- [ ] Implementar rate limit
- [ ] Criar documentação Swagger
- [ ] Implementar cache

---

## 📄 Observações Finais

Este documento deve ser mantido atualizado conforme o projeto evolui.

