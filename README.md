# Nueera Growth OS — Monorepo

Enterprise-grade business operating system with CRM, ERP, Marketing, Finance, Analytics, and Automation modules.

## Architecture

```
nueera-growth-os/
├── frontend/          Next.js 15+ SaaS frontend (TypeScript, Tailwind, shadcn/ui)
├── backend/           FastAPI async backend (Python 3.12, SQLAlchemy, PostgreSQL)
├── workers/           Celery background workers
├── shared/            Shared TypeScript types and API contracts
├── infra/
│   ├── docker/        Docker Compose + multi-stage Dockerfiles
│   └── nginx/         Reverse proxy configuration
├── scripts/           Setup, migration, and seeding scripts
├── docs/              Technical documentation
├── tests/
│   ├── e2e/           End-to-end tests
│   └── integration/   Integration tests
│
├── docker-compose.yml
├── .env.example
├── Makefile
└── README.md
```

## Quick Start

### Prerequisites
- **Node.js** >= 20
- **Bun** (latest)
- **Python** >= 3.12
- **Docker** + Docker Compose

### One-command setup
```bash
make setup
```

### Manual setup
```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Start infrastructure (PostgreSQL + Redis)
docker compose -f infra/docker/docker-compose.yml up -d db redis

# 3. Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# 4. Frontend (separate terminal)
cd frontend
bun install
bun dev
```

Open **http://localhost:3000** for the frontend, **http://localhost:8000/docs** for API docs.

## Development

### Full stack (Docker)
```bash
docker compose -f infra/docker/docker-compose.yml up -d --build
```

### Backend only
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### Frontend only
```bash
cd frontend
bun dev
```

### Database migrations
```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## Modules

| Module | Description |
|--------|-------------|
| **CRM & Sales** | Contacts, leads, deals, pipeline, forecasting |
| **ERP** | HR, projects, payroll, assets, approvals |
| **Marketing** | Campaigns, email builder, social, analytics |
| **Finance** | Invoices, budgets, P&L, cashflow, tax |
| **Retention** | Churn, cohorts, loyalty, NPS, LTV |
| **Analytics** | Dashboards, AI insights, custom reports |
| **Automation** | Workflow builder, triggers, actions |
| **Settings** | Users, roles, integrations, billing |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| State | Zustand, TanStack React Query |
| Backend | FastAPI, SQLAlchemy (async), Pydantic v2 |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis 7, Celery |
| Reverse Proxy | nginx |
| Containerization | Docker, Docker Compose |

## License

Private — All rights reserved.
