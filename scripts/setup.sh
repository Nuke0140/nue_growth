#!/usr/bin/env bash
set -euo pipefail

echo "=== Nueera Growth OS — Project Setup ==="
echo ""

# ── Backend setup ──
echo "[1/4] Setting up backend..."
cd backend
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..
echo "  ✓ Backend ready"

# ── Frontend setup ──
echo "[2/4] Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    bun install
fi
cd ..
echo "  ✓ Frontend ready"

# ── Database setup ──
echo "[3/4] Setting up database..."
if docker compose -f infra/docker/docker-compose.yml ps db | grep -q "running"; then
    echo "  ✓ Database already running"
else
    docker compose -f infra/docker/docker-compose.yml up -d db redis
    echo "  Waiting for database..."
    sleep 5
    echo "  ✓ Database started"
fi

# ── Summary ──
echo ""
echo "[4/4] Setup complete!"
echo ""
echo "  Backend:  cd backend && source .venv/bin/activate && uvicorn app.main:app --reload"
echo "  Frontend: cd frontend && bun dev"
echo "  Infra:    docker compose -f infra/docker/docker-compose.yml up -d"
echo ""
echo "  Full stack: docker compose -f infra/docker/docker-compose.yml up -d"
