# Nueera Growth OS — Backend

FastAPI + SQLAlchemy async + PostgreSQL + Celery + Redis

## Quick Start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── celery_app.py        # Celery worker configuration
│   ├── api/
│   │   ├── deps.py          # Dependency injection (auth, DB session)
│   │   └── routes/
│   │       ├── auth.py      # Login, register, refresh, /me
│   │       └── health.py    # Health check endpoint
│   ├── core/
│   │   ├── config.py        # Pydantic settings from .env
│   │   └── security.py      # JWT + bcrypt utilities
│   ├── db/
│   │   ├── base.py          # SQLAlchemy declarative base
│   │   └── session.py       # Async engine + session factory
│   ├── models/
│   │   └── user.py          # User ORM model
│   ├── schemas/
│   │   ├── auth.py          # Auth request/response DTOs
│   │   └── user.py          # User DTOs
│   └── tasks/
│       └── email.py         # Celery email tasks
├── alembic/                 # Database migrations
├── alembic.ini              # Alembic configuration
├── requirements.txt         # Python dependencies
└── Dockerfile               # Container build
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get access + refresh tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| GET  | `/api/auth/me` | Get current user profile |
| GET  | `/api/health` | Health check |
