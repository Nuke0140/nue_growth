.PHONY: help setup dev dev-frontend dev-backend db migrate seed lint build clean docker docker-down test

# ── Help ─────────────────────────────────────────────────
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ── Setup ────────────────────────────────────────────────
setup: ## Full project setup (venv, install, db)
	@echo "=== Setting up Nueera Growth OS ==="
	cd backend && python3 -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt
	cd frontend && bun install
	docker compose -f infra/docker/docker-compose.yml up -d db redis
	@sleep 3 && cd backend && . .venv/bin/activate && alembic upgrade head
	@echo "=== Setup complete ==="

# ── Development ──────────────────────────────────────────
dev: ## Start both backend and frontend for development
	@echo "Starting backend and frontend..."
	$(MAKE) -j2 dev-backend dev-frontend

dev-backend: ## Start backend server
	cd backend && . .venv/bin/activate && uvicorn app.main:app --reload --port 8000

dev-frontend: ## Start frontend dev server
	cd frontend && bun dev

# ── Database ─────────────────────────────────────────────
db: ## Start PostgreSQL and Redis only
	docker compose -f infra/docker/docker-compose.yml up -d db redis

migrate: ## Run database migrations
	cd backend && . .venv/bin/activate && alembic upgrade head

migration-create: ## Create a new migration (usage: make migration-create MSG="add users table")
	cd backend && . .venv/bin/activate && alembic revision --autogenerate -m "$(MSG)"

seed: ## Seed development data
	cd backend && . .venv/bin/activate && python -m app.tasks.seed

db-reset: ## Reset database (WARNING: destroys data)
	cd backend && . .venv/bin/activate && alembic downgrade base && alembic upgrade head

# ── Docker ───────────────────────────────────────────────
docker: ## Start full stack via Docker Compose
	docker compose -f infra/docker/docker-compose.yml up -d --build

docker-down: ## Stop all Docker services
	docker compose -f infra/docker/docker-compose.yml down

docker-logs: ## Tail Docker logs
	docker compose -f infra/docker/docker-compose.yml logs -f

# ── Quality ──────────────────────────────────────────────
lint: ## Run linters (backend + frontend)
	cd backend && . .venv/bin/activate && ruff check . || true
	cd frontend && bun lint || true

lint-fix: ## Auto-fix linting issues
	cd backend && . .venv/bin/activate && ruff check --fix . || true
	cd frontend && bun lint --fix || true

# ── Build ────────────────────────────────────────────────
build: ## Build frontend for production
	cd frontend && bun run build

# ── Test ─────────────────────────────────────────────────
test: ## Run all tests
	cd backend && . .venv/bin/activate && pytest || true
	cd frontend && bun test || true

test-backend: ## Run backend tests
	cd backend && . .venv/bin/activate && pytest

test-frontend: ## Run frontend tests
	cd frontend && bun test

# ── Clean ────────────────────────────────────────────────
clean: ## Remove build artifacts and caches
	rm -rf frontend/.next frontend/node_modules
	rm -rf backend/.venv backend/__pycache__ backend/.pytest_cache
	docker compose -f infra/docker/docker-compose.yml down -v --rmi local
	@echo "Clean complete."
