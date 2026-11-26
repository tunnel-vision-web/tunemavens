#!/usr/bin/env bash
set -euo pipefail

# Intermaven & TuneMavens Ecosystem VPS Deployment Script
# Run from repository root on the target Ubuntu/Debian VPS.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

if [ ! -f "$SCRIPT_DIR/.env.production" ]; then
  echo "ERROR: Missing $SCRIPT_DIR/.env.production"
  echo "Copy deploy/vps/.env.production.template to deploy/vps/.env.production and set live secrets first."
  exit 1
fi

echo "==> 1. Installing root workspace dependencies & building frontends..."
npm ci
npm run build:all

echo "==> 2. Building & launching production containers (MongoDB, FastAPI, Express, Nginx)..."
docker compose -f "$SCRIPT_DIR/docker-compose.prod.yml" --env-file "$SCRIPT_DIR/.env.production" up -d --build

echo "==> 3. Verifying container health..."
sleep 5
docker compose -f "$SCRIPT_DIR/docker-compose.prod.yml" ps
curl -fsS http://127.0.0.1:8001/health && echo " -> FastAPI Backend OK"

echo "==> Deployment complete! Next: run certbot --nginx for SSL on intermaven.io, tunemavens.com, tunestream.co, syncmavens.com"
