#!/usr/bin/env bash
# ==========================================================================
# TuneMavens — every-push deploy. Runs on the VPS after bootstrap.
# ==========================================================================
# Expects the following env vars from the GitHub Actions workflow:
#   APP_DOMAIN, MONGO_URL, DB_NAME, JWT_SECRET, EMERGENT_LLM_KEY, GIT_SHA
# ==========================================================================
set -euo pipefail

: "${APP_DOMAIN:?APP_DOMAIN required}"
: "${MONGO_URL:?MONGO_URL required}"
: "${DB_NAME:?DB_NAME required}"
: "${JWT_SECRET:?JWT_SECRET required}"
: "${GIT_SHA:?GIT_SHA required}"
EMERGENT_LLM_KEY="${EMERGENT_LLM_KEY:-}"

APP_DIR="/opt/tunemavens"
APP_USER="tunemavens"
REPO_DIR="$APP_DIR/repo"
SHARED_DIR="$APP_DIR/shared"
REPO_URL="${REPO_URL:-https://github.com/${GITHUB_REPOSITORY:-}.git}"

echo "==> Fetching source (commit $GIT_SHA)"
if [ ! -d "$REPO_DIR/.git" ]; then
  # First deploy: clone. GITHUB_REPOSITORY env is only set in Actions,
  # so we allow passing REPO_URL explicitly for manual runs.
  if [ -z "$REPO_URL" ] || [ "$REPO_URL" = "https://github.com/.git" ]; then
    echo "REPO_URL not set and this is a first-run — pass REPO_URL=owner/repo"
    exit 1
  fi
  sudo -u "$APP_USER" git clone --depth 20 "$REPO_URL" "$REPO_DIR"
fi
cd "$REPO_DIR"
sudo -u "$APP_USER" git fetch --depth 20 origin
sudo -u "$APP_USER" git checkout -q "$GIT_SHA"

echo "==> Writing backend env file (owned by app user, chmod 600)"
cat >"$SHARED_DIR/backend.env" <<ENV
MONGO_URL=$MONGO_URL
DB_NAME=$DB_NAME
JWT_SECRET=$JWT_SECRET
COOKIE_DOMAIN=$APP_DOMAIN
CORS_ORIGINS=https://$APP_DOMAIN,https://www.$APP_DOMAIN
EMERGENT_LLM_KEY=$EMERGENT_LLM_KEY
ENV
chown "$APP_USER:$APP_USER" "$SHARED_DIR/backend.env"
chmod 600 "$SHARED_DIR/backend.env"

echo "==> Installing Python deps + creating venv"
sudo -u "$APP_USER" bash -c "
  cd $REPO_DIR/backend
  if [ ! -d .venv ]; then python3.11 -m venv .venv; fi
  ./.venv/bin/pip install --upgrade pip --quiet
  ./.venv/bin/pip install -r requirements.txt --quiet
  # Emergent LLM library lives on a private index; install with the extra
  # index URL. Skips silently if the package is already at the right rev.
  ./.venv/bin/pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/ --quiet || true
"

echo "==> Building frontend (Vite production build)"
# Point the client at the same-origin backend — nginx routes /api → :8001.
cat >"$REPO_DIR/.env.production" <<ENV
VITE_API_BASE_URL=
ENV
sudo -u "$APP_USER" bash -c "
  cd $REPO_DIR
  # yarn is faster + honours the checked-in lockfile.
  yarn install --frozen-lockfile
  yarn build
"

echo "==> (Re)starting systemd service"
systemctl restart tunemavens-backend
systemctl enable tunemavens-backend >/dev/null 2>&1 || true

echo "==> Reloading nginx"
nginx -t
systemctl reload nginx

echo "==> Deploy done. Commit $GIT_SHA is live on https://$APP_DOMAIN"
