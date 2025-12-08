# Multi-Tenant-Inventory-SaaS-Server

A production-ready, high-performance, multi-tenant inventory management backend.

---

## Tech Stack

* **Node.js + Express** – backend runtime and framework
* **TypeScript** – type safety and better developer experience
* **Prisma ORM** – database modeling, migrations, and query generation
* **PostgreSQL** – shared database for multi-tenant architecture (shared schema)
* **Docker + Docker Compose** – containerized development environment

---

## Current Status

* Prisma schema is fully defined:

  * Tenants, Users, Items, Warehouses, Stock Movements
* Roles: `ADMIN`, `MANAGER`, `USER`
* Stock movement type: `IN`, `OUT`
* Tenant creation endpoint implemented (POST /api/tenant)
* Controller → Service → Repository pattern applied
* Validation using Zod
* Swagger/OpenAPI documentation available
* Docker environment ready for Postgres + Adminer
* Prisma client generation ready

---

## Project Structure

```
├─ src/
│  ├─ api/              # API routes
│  │  ├─ tenant/        # Tenant routes
│  │  └─ user/          # User routes
│  ├─ api-docs/         # Swagger/OpenAPI documentation
│  ├─ server.ts         # Backend entry point
│  ├─ index.ts          # Main entry point
│  ├─ prisma/           # Prisma client & config
│  ├─ generated/        # Prisma generated client
│  └─ common/           # Shared utilities (logging, errors, etc.)
├─ prisma.schema         # Prisma database schema
├─ Dockerfile            # Backend container
├─ docker-compose.yml    # Dev environment with Postgres + Adminer
├─ package.json
├─ tsconfig.json
└─ .env.example          # Example environment variables
```

---

## Planned Features / Next Steps

* GET /tenants and GET /tenant/:id endpoints
* User authentication & authorization (JWT + roles)
* CRUD for Items and Warehouses
* Stock movement tracking (IN / OUT)
* Reusable Zod validation middleware
* Additional Swagger/OpenAPI documentation for all endpoints
* Integration and unit testing

---

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/AAYUSKARKI/Multi-Tenant-Inventory-SaaS-Server
cd Multi-Tenant-Inventory-SaaS-Server
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file

```env
PORT=8000
DATABASE_URL=postgresql://postgres:postgres@db:5432/multi_tenant_inventory
```

4. Start Docker services

```bash
docker compose up -d db
```

5. Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

6. Generate Prisma client

```bash
npx prisma generate
```

7. Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Access at `http://localhost:5555`

---

## Contribution Guidelines

* Use feature branches: `feature/<feature-name>`
* Chore branches: `chore/<task>`
* Follow conventional commit messages: `feat:`, `fix:`, `chore:`
* Submit Pull Requests for code review

---

## License

MIT © [AAYUS KARKI](https://github.com/AAYUSKARKI)
