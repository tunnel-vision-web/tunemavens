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
# 2. Build the Vite frontend workspaces
# --------------------------------------------------------------------------
echo "==> Installing frontend workspace dependencies"
sudo -u "$APP_USER" bash -c "cd '$REPO_DIR' && npm install --silent"

echo "==> Building frontend workspace bundles (VITE_API_BASE_URL=https://api.tunemavens.com)"
sudo -u "$APP_USER" bash -c "cd '$REPO_DIR' && VITE_API_BASE_URL='https://api.tunemavens.com' npm run build:portal && VITE_API_BASE_URL='https://api.tunemavens.com' npm run build:tunestream && VITE_API_BASE_URL='https://api.tunemavens.com' npm run build:syncmavens"

echo "==> Deploying frontend static sites atomically"

sync_dir_atomically() {
  local src_dist=$1
  local target_dir=$2
  local new_dir="${target_dir}_new"
  local old_dir="${target_dir}_old"

  sudo -u "$APP_USER" mkdir -p "$(dirname "$target_dir")"
  sudo -u "$APP_USER" rm -rf "$new_dir"
  sudo -u "$APP_USER" mkdir -p "$new_dir"
  sudo -u "$APP_USER" cp -r "$src_dist/"* "$new_dir/"

  if [ -d "$target_dir" ]; then
    sudo -u "$APP_USER" mv "$target_dir" "$old_dir"
  fi
  sudo -u "$APP_USER" mv "$new_dir" "$target_dir"
  sudo -u "$APP_USER" rm -rf "$old_dir"
}

deploy_app_atomically() {
  local app_name=$1
  local src_dist=$2

  echo "==> Atomic deploy for $app_name"
  # 1. Standard /opt/tunemavens/dist/<app> path
  sync_dir_atomically "$src_dist" "$APP_DIR/dist/$app_name"
  # 2. Live Nginx hbuilds path served by /etc/nginx/conf.d/tunemavens.conf
  sync_dir_atomically "$src_dist" "$APP_DIR/domains/tunemavens.com/hbuilds/last-source/apps/$app_name/dist"
}

deploy_app_atomically "portal" "$REPO_DIR/apps/portal/dist"
deploy_app_atomically "tunestream" "$REPO_DIR/apps/tunestream/dist"
deploy_app_atomically "syncmavens" "$REPO_DIR/apps/syncmavens/dist"

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
MONGO_URL=${MONGO_URL:-}
MONGO_USER=${MONGO_USER:-}
MONGO_PASSWORD=${MONGO_PASSWORD:-}
MONGO_HOST=${MONGO_HOST:-}
MONGO_SCHEME=${MONGO_SCHEME:-mongodb+srv}
MONGO_OPTIONS=${MONGO_OPTIONS:-retryWrites=true&w=majority}
DB_NAME=${DB_NAME:-intermaven}
JWT_SECRET=${JWT_SECRET}
EMERGENT_LLM_KEY=${EMERGENT_LLM_KEY:-}
APP_DOMAIN=${APP_DOMAIN}
CORS_ORIGINS=https://${APP_DOMAIN},https://www.${APP_DOMAIN},https://tunestream.co,https://www.tunestream.co,https://syncmavens.com,https://www.syncmavens.com,https://intermaven.io,https://www.intermaven.io
COOKIE_DOMAIN=.${APP_DOMAIN}
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ENV
chown "$APP_USER:$APP_USER" "$SHARED_DIR/backend.env"
chmod 600 "$SHARED_DIR/backend.env"

# --------------------------------------------------------------------------
# 5. Ensure Nginx allows large audio mix uploads (up to 250MB) without touching certbot SSL config
# --------------------------------------------------------------------------
echo "==> Ensuring Nginx large upload limits"
cat > /etc/nginx/conf.d/00-tunemavens-uploads.conf <<'NGX_UPLOADS'
client_max_body_size 250M;
client_body_timeout 300s;
proxy_read_timeout 300s;
proxy_send_timeout 300s;
NGX_UPLOADS
if ! nginx -t >/dev/null 2>&1; then
  rm -f /etc/nginx/conf.d/00-tunemavens-uploads.conf
fi

# --------------------------------------------------------------------------
# 6. Restart backend + reload nginx
# --------------------------------------------------------------------------
echo "==> Restarting backend service"
systemctl restart tunemavens-backend

echo "==> Reloading nginx"
systemctl reload nginx || systemctl restart nginx

echo "==> Deploy complete — serving commit ${GIT_SHA:-unknown}"