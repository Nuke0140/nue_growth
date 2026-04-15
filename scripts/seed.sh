#!/usr/bin/env bash
set -euo pipefail

echo "=== Seeding Development Data ==="
cd backend
source .venv/bin/activate 2>/dev/null || true
python -m app.tasks.seed
echo "✓ Seed data created"
