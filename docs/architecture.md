# Architecture

## System Overview

```
                    ┌─────────────┐
                    │   nginx:80  │
                    │  (reverse   │
                    │   proxy)    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ frontend │ │ backend  │ │  docs    │
        │  :3000   │ │  :8000   │ │  :8000   │
        └──────────┘ └────┬─────┘ └──────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        ┌──────────┐ ┌────────┐ ┌────────┐
        │PostgreSQL│ │ Redis  │ │ Celery │
        │  :5432   │ │ :6379  │ │Worker  │
        └──────────┘ └────────┘ └────────┘
```

## Backend Architecture (FastAPI)

```
backend/
├── app/
│   ├── main.py              Application factory with CORS
│   ├── celery_app.py        Celery broker configuration
│   ├── api/
│   │   ├── deps.py          Auth + DB session injection
│   │   └── routes/          Route modules (auth, health, ...)
│   ├── core/
│   │   ├── config.py        Pydantic Settings (.env)
│   │   └── security.py      JWT + bcrypt
│   ├── db/
│   │   ├── base.py          SQLAlchemy DeclarativeBase
│   │   └── session.py       Async engine + sessionmaker
│   ├── models/              ORM models (SQLAlchemy)
│   ├── schemas/             Pydantic DTOs
│   └── tasks/               Celery async tasks
├── alembic/                 Database migrations
├── requirements.txt
└── Dockerfile
```

## Frontend Architecture (Next.js)

```
frontend/
├── src/
│   ├── app/                 Next.js App Router
│   ├── components/
│   │   ├── ui/              shadcn/ui primitives (48 components)
│   │   ├── auth/            Auth page wrapper
│   │   └── dashboard/       Main dashboard (WindowsDesktop)
│   ├── modules/             Feature modules (9 total)
│   │   ├── crm-sales/       Unified CRM + Sales
│   │   ├── erp/             Enterprise Resource Planning
│   │   ├── marketing/       Campaigns & outreach
│   │   ├── finance/         Accounts & budgeting
│   │   ├── retention/       Growth & churn
│   │   ├── analytics/       BI & reporting
│   │   ├── automation/      Workflows & triggers
│   │   ├── settings/        Config & admin
│   │   └── auth/            Login, register, OTP
│   ├── hooks/               Custom React hooks
│   ├── lib/                 Utilities (http, db, utils)
│   ├── providers/           Context providers (QueryProvider)
│   ├── store/               Global Zustand stores
│   └── types/               TypeScript type definitions
├── prisma/                  Prisma schema (SQLite dev)
├── public/                  Static assets
└── package.json
```

## Module Internal Structure

Each frontend module follows the same pattern:

```
src/modules/<module>/
├── <module>-layout.tsx      Module shell (header + sidebar + content)
├── <module>-store.ts        Zustand state management
├── types.ts                 Module-specific TypeScript types
├── data/
│   └── mock-data.ts         Mock data for development
├── components/              Module-specific components
│   ├── chart-card.tsx
│   ├── kpi-card.tsx
│   └── ...
└── <page>-page.tsx          Individual page components
```

## Authentication Flow

```
User → Login Page → POST /api/auth/login
  → Backend validates credentials
  → Returns { access_token, refresh_token }
  → Frontend stores tokens in Zustand
  → All API requests include Authorization: Bearer header
  → Token refresh via POST /api/auth/refresh
```

## Database Schema

Currently: PostgreSQL (via SQLAlchemy async)

Tables:
- `user` — id, email, hashed_password, full_name, is_active, is_superuser, tenant_id, created_at, updated_at

Extending: Use Alembic migrations
```bash
cd backend && alembic revision --autogenerate -m "description"
```
