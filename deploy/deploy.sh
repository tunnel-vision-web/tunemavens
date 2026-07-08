#!/usr/bin/env bash
# ==========================================================================
# TuneMavens — deploy script  (runs on VPS via GitHub Actions SSH step)
# ==========================================================================
# Required env vars (set by the workflow):
#   APP_DOMAIN, MONGO_URL, DB_NAME, JWT_SECRET, EMERGENT_LLM_KEY, GIT_SHA
# ==========================================================================
set -euo pipefail

APP_DIR="/opt/tunemavens"
APP_USER="tunemavens"
REPO_DIR="$APP_DIR/repo"
SHARED_DIR="$APP_DIR/shared"

echo "==> Deploying commit ${GIT_SHA:-unknown}"

# --------------------------------------------------------------------------
# 1. Pull latest code
# --------------------------------------------------------------------------
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "==> Cloning repo for the first time"
  sudo -u "$APP_USER" git clone https://github.com/tunnel-vision-web/tunemavens.git "$REPO_DIR"
else
  echo "==> Pulling latest from main"
  sudo -u "$APP_USER" git -C "$REPO_DIR" fetch --prune origin
  sudo -u "$APP_USER" git -C "$REPO_DIR" reset --hard origin/main
fi

# --------------------------------------------------------------------------
# 2. Build the Vite frontend  →  dist/
# --------------------------------------------------------------------------
echo "==> Installing frontend dependencies"
sudo -u "$APP_USER" bash -c "cd '$REPO_DIR' && npm ci --silent"

echo "==> Building frontend bundle"
sudo -u "$APP_USER" bash -c "cd '$REPO_DIR' && npm run build"

# --------------------------------------------------------------------------
# 3. Backend Python venv + dependencies
# --------------------------------------------------------------------------
BACKEND_DIR="$REPO_DIR/backend"

if [ ! -d "$BACKEND_DIR/.venv" ]; then
  echo "==> Creating Python venv"
  sudo -u "$APP_USER" python3.11 -m venv "$BACKEND_DIR/.venv"
fi

echo "==> Installing backend dependencies"
sudo -u "$APP_USER" "$BACKEND_DIR/.venv/bin/pip" install -q -r "$BACKEND_DIR/requirements.txt"

# --------------------------------------------------------------------------
# 4. Write backend env file (idempotent)
# --------------------------------------------------------------------------
echo "==> Writing backend environment file"
mkdir -p "$SHARED_DIR"
cat > "$SHARED_DIR/backend.env" <<ENV
MONGO_URL=${MONGO_URL}
DB_NAME=${DB_NAME:-intermaven}
JWT_SECRET=${JWT_SECRET}
EMERGENT_LLM_KEY=${EMERGENT_LLM_KEY:-}
APP_DOMAIN=${APP_DOMAIN}
CORS_ORIGINS=https://${APP_DOMAIN},https://www.${APP_DOMAIN}
COOKIE_DOMAIN=.${APP_DOMAIN}
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ENV
chown "$APP_USER:$APP_USER" "$SHARED_DIR/backend.env"
chmod 600 "$SHARED_DIR/backend.env"

# --------------------------------------------------------------------------
# 5. Restart backend + reload nginx
# --------------------------------------------------------------------------
echo "==> Restarting backend service"
systemctl restart tunemavens-backend

echo "==> Reloading nginx"
systemctl reload nginx || systemctl restart nginx

echo "==> Deploy complete — serving commit ${GIT_SHA:-unknown}"