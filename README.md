# Multi-Tenant Inventory SaaS Server

A robust, production-ready backend for multi-tenant inventory
management. This SaaS solution enables multiple tenants to securely
manage users, items, warehouses, and stock movements within a shared
PostgreSQL database, ensuring data isolation through tenant-specific
identifiers. Built with scalability, security, and performance in mind,
it supports JWT-based authentication, role-based access control (RBAC),
and efficient querying via Prisma ORM.

## Table of Contents

-   Features
-   Tech Stack
-   Project Structure
-   Getting Started
    -   Prerequisites
    -   Installation
    -   Running the Application
    -   Database Management
-   API Documentation
    -   Full Endpoints
    -   Tenant Management
    -   User Management
    -   Item Management
    -   Warehouse Management
    -   Stock Management
-   Security Considerations
-   Testing
-   Deployment
-   Database Schema Overview
-   Contributing
-   License

## Features

-   **Multi-Tenancy:** Isolated data for each tenant in a shared schema,
    with automatic tenant scoping on all operations.
-   **User Management:** Secure registration, authentication
    (login/logout/token refresh), RBAC (Admin, Manager, User), and
    tenant association.
-   **Inventory Management:** CRUD operations for items (with SKU
    uniqueness per tenant), warehouses, and stock movements
    (inbound/outbound).
-   **Stock Tracking:** Real-time balance queries, movement history, and
    indexed queries for high performance.
-   **API Security:** JWT authentication for protected routes, bcrypt
    password hashing, and refresh tokens for session management.
-   **Error Handling:** Standardized error responses with descriptive
    messages.
-   **API Documentation:** OpenAPI 3.0 specification.
-   **Testing:** Full support for unit and integration tests.
-   **Containerization:** Dockerized for consistent deployment.
-   **Scalability:** Stateless API and efficient indexing.

## Tech Stack

-   **Runtime & Framework:** Node.js (v18+), Express.js
-   **Language:** TypeScript
-   **ORM:** Prisma
-   **Database:** PostgreSQL
-   **Authentication:** JWT with refresh tokens
-   **Security:** bcrypt, helmet, rate limiting (optional)
-   **API Docs:** Swagger/OpenAPI 3.0
-   **Containerization:** Docker, Docker Compose
-   **Testing Tools:** Jest, Supertest

## Project Structure

    ├── src/
    │   ├── api/
    │   │   ├── tenant/
    │   │   ├── user/
    │   │   ├── item/
    │   │   ├── warehouse/
    │   │   └── stock/
    │   ├── common/
    │   ├── middleware/
    │   ├── api-docs/
    │   ├── generated/
    │   ├── prisma/
    │   ├── server.ts
    │   └── index.ts
    ├── prisma/
    │   └── schema.prisma
    ├── tests/
    ├── Dockerfile
    ├── docker-compose.yml
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    ├── .gitignore
    └── README.md

## Getting Started

### Prerequisites

-   Node.js \>= 18
-   npm \>= 9
-   Docker & Docker Compose
-   PostgreSQL \>= 14

### Installation

``` bash
git clone https://github.com/AAYUSKARKI/Multi-Tenant-Inventory-SaaS-Server.git
cd Multi-Tenant-Inventory-SaaS-Server
npm install
```

Create `.env` file:

    PORT=8000
    DATABASE_URL=postgresql://postgres:postgres@localhost:5432/multi_tenant_inventory?schema=public
    JWT_SECRET=<generated>
    REFRESH_TOKEN_SECRET=<generated>
    NODE_ENV=development

Start database:

``` bash
docker compose up -d db
```

Apply migrations:

``` bash
npx prisma migrate deploy
```

Generate client:

``` bash
npx prisma generate
```

### Running the Application

Development:

``` bash
npm run dev
```

Production:

``` bash
npm run build
npm start
```

### Database Management

Use Prisma Studio:

``` bash
npx prisma studio
```

## API Documentation

Accessible at `/api-docs`.

### Endpoints

#### Tenant Management

-   POST `/api/tenant`
-   GET `/api/tenant`
-   GET `/api/tenant/{id}`
-   PUT `/api/tenant/{id}`
-   DELETE `/api/tenant/{id}`

#### User Management

-   POST `/api/user`
-   GET `/api/user`
-   POST `/api/user/tenantbyemail`
-   POST `/api/user/login`
-   GET `/api/user/{id}`
-   PUT `/api/user/{id}`
-   DELETE `/api/user/{id}`
-   POST `/api/user/refreshtoken`
-   POST `/api/user/logout`

#### Item Management

-   POST `/api/item`
-   GET `/api/item`
-   GET `/api/item/{id}`
-   PUT `/api/item/{id}`
-   DELETE `/api/item/{id}`

#### Warehouse Management

-   POST `/api/warehouse`
-   GET `/api/warehouse`
-   GET `/api/warehouse/{id}`
-   PUT `/api/warehouse/{id}`
-   DELETE `/api/warehouse/{id}`

#### Stock Management

-   POST `/api/stock`
-   GET `/api/stock`
-   GET `/api/stock/balance`
-   GET `/api/stock/{id}`
-   PUT `/api/stock/{id}`
-   DELETE `/api/stock/{id}`

## Security Considerations

-   JWT Authentication
-   RBAC
-   Tenant ID scoping
-   Input validation (Joi/Zod)
-   Rate limiting
-   HTTPS enforcement
-   Secure secret management
-   Auditing logs

## Testing

Run tests:

``` bash
npm test
```

## Deployment

-   Docker build & run
-   Suitable for AWS/Heroku/Vercel
-   CI/CD via GitHub Actions

## Database Schema Overview

-   Tenant
-   User
-   Item
-   Warehouse
-   StockMovement
-   Soft deletes enabled

## Contributing

-   Feature branches
-   Conventional commits
-   Pull Request guidelines

## License

MIT © 2025 AAYUS KARKI
