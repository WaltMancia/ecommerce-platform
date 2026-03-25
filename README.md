# 🛍️ E-Commerce Platform

Plataforma completa de comercio electrónico construida con React, Node.js y MySQL.

[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://mysql.com)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://docker.com)

## 🏗️ Arquitectura
```
frontend/          React + Vite + Zustand
backend/           Node.js + Express (Clean Architecture)
  ├── domain/      Entidades e interfaces
  ├── application/ Casos de uso y servicios
  ├── infrastructure/ BD, repos, utils
  └── interfaces/  Controllers, routes, middlewares
```

## ⚙️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Vite, Zustand, Tailwind CSS |
| Backend | Node.js, Express, Clean Architecture |
| Base de datos | MySQL 8 + Sequelize ORM |
| Autenticación | JWT + Refresh Tokens |
| Pagos | Stripe |
| Documentación | Swagger / OpenAPI 3.0 |
| Contenedores | Docker + Docker Compose |

## 🚀 Levantar con Docker
```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/ecommerce-platform.git
cd ecommerce-platform

# Copia y configura las variables de entorno
cp .env.example .env
# Edita .env con tus valores

# Levanta todos los servicios
docker-compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:3000 |
| Swagger Docs | http://localhost:3000/api/docs |

## 🔧 Desarrollo local (sin Docker)
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

## 🔐 Variables de entorno

Copia `.env.example` a `.env` y completa los valores:
```
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=
JWT_REFRESH_SECRET=
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## 📚 API Docs

Documentación interactiva disponible en `/api/docs` con Swagger UI.

## ✅ Funcionalidades

- Autenticación con JWT y refresh tokens
- Catálogo de productos con búsqueda y paginación
- Carrito de compras persistente
- Checkout con Stripe
- Panel de administración
- Roles y permisos (RBAC)
```

También crea `.env.example` en la raíz (este sí sube a GitHub, sin valores reales):
```
DB_NAME=ecommerce_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
VITE_API_URL=http://localhost:3000/api/v1
VITE_STRIPE_PUBLIC_KEY=