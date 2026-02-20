# Documentação do Frontend com Vite + TypeScript

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
- Autenticação: JWT
- Validação de dados: Zod

---

## 🧱 Arquitetura do Sistema

O backend segue uma arquitetura em camadas, separando responsabilidades para facilitar manutenção e escalabilidade.

### Modulos

- **Routes**: Definição das rotas HTTP
- **Controllers**: Entrada das requisições e respostas
- **Services**: Regras de negócio
- **Schemas**: Validações

---

## 📁 Estrutura de Pastas

```txt
web/
 ├── src/
 │    ├── assets/
 │    │         ├── *.png
 │    │         ├── *.svg
 │    ├── auth/
 │    ├── components/
 │    │    └── ui/
 │    ├── contexts/
 │    ├── lib/
 │    ├── pages/
 │    ├── routes/
 │    ├── types/
 │    ├── App.tsx
 │    ├── index.css
 │    └── main.tsx
 ├── .env
 ├── vite.config.ts
 ├── tsconfig.tsbuildinfo
 ├── .gitignore
 ├── tsconfig.json
 └── package.json
 
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
- Apenas usuários logados acessam rotas protegidas
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

- 200 → Autorizado
- 201 → Bem sucedido
- 400 → Requisição inválida
- 401 → Não autorizado
- 403 → Proibido
- 404 → Não encontrado
- 500 → Erro interno do servidor

---

## 📄 Observações Finais

Este documento deve ser mantido atualizado conforme o projeto evolui.

