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
* Docker environment ready for Postgres + Adminer
* Prisma client generation ready

---

## Project Structure

```
├─ src/
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
