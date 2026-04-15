#!/usr/bin/env bash
set -euo pipefail

echo "=== Running Database Migrations ==="
cd backend
source .venv/bin/activate 2>/dev/null || true
alembic upgrade head
echo "✓ Migrations complete"
