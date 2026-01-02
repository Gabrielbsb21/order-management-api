# Order Management API

API Backend construída com NestJS para gerenciamento de clientes e pedidos, utilizando MongoDB para persistência de dados, integração com API externa para conversão de moeda, processamento assíncrono com BullMQ e Redis, upload local de arquivos (com abstração preparada para AWS S3), relatórios com aggregation e documentação completa via Swagger.

---

## 📌 Features

- CRUD de **Clientes**
- CRUD de **Pedidos**
- Conversão de valores **USD → BRL** via API externa
- Upload de comprovantes (implementação local com abstração para S3)
- Processamento assíncrono com **BullMQ + Redis**
- Relatório de **Top Clientes por valor gasto**
- Paginação de pedidos
- Validação de dados com DTOs
- Documentação automática com **Swagger**
- Testes unitários com **Jest**

---

## 🏗️ Arquitetura

O projeto segue a arquitetura modular recomendada pelo NestJS, com clara separação de responsabilidades:

```
src/
 ├── customers/
 ├── orders/
 ├── exchange/
 ├── notifications/
 ├── upload/
 ├── reports/
 └── app.module.ts
```

---

## 🗄️ Persistência

- MongoDB + Mongoose
- Schemas com timestamps
- Paginação e aggregation pipeline

---

## 🔄 Processamento Assíncrono

- BullMQ + Redis
- Fila de notificações para pedidos

---

## 🌐 Integrações Externas

- Cotação USD → BRL via AwesomeAPI
- Axios com tratamento de erro

---

## 📎 Upload de Comprovantes

- multipart/form-data
- Implementação local
- Estrutura pronta para AWS S3
- Pasta uploads ignorada no Git

---

## 📊 Relatórios

```
GET /relatorios/top-clientes?limit=5
```

---

## 🧪 Testes

```bash
npm run test
```

---

## 📚 Swagger

```
http://localhost:3000/api
```

---

## ⚙️ Ambiente

```env
PORT=3000
MONGO_URI=mongodb://mongo:mongo@localhost:27017/orders_db?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## ▶️ Rodando o projeto

```bash
docker compose up -d
npm install
npm run start:dev
```
