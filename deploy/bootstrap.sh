#!/usr/bin/env bash
# ==========================================================================
# TuneMavens — first-run + upgrade bootstrap for Hostinger AlmaLinux 9 VPS
# ==========================================================================
# Idempotent. Safe to run on every deploy. Only installs anything if
# missing. Expects `APP_DOMAIN` in the environment.
# ==========================================================================
set -euo pipefail

: "${APP_DOMAIN:?APP_DOMAIN must be set}"
APP_DIR="/opt/tunemavens"
APP_USER="tunemavens"

echo "==> Ensuring EPEL + Remi repos (Python 3.11 lives in AppStream by default on Alma 9)"
dnf -y install epel-release || true

echo "==> Installing OS packages"
dnf -y install git curl tar gcc make openssl-devel bzip2-devel libffi-devel \
                nginx firewalld policycoreutils-python-utils certbot python3-certbot-nginx >/dev/null

echo "==> Python 3.11"
if ! command -v python3.11 >/dev/null 2>&1; then
  dnf -y install python3.11 python3.11-pip python3.11-devel >/dev/null
fi

echo "==> Node 20 (via NodeSource)"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1)" != "v20" ]; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf -y install nodejs >/dev/null
  npm install -g yarn --silent
fi

echo "==> MongoDB 7 (local, bound to 127.0.0.1)"
if ! command -v mongod >/dev/null 2>&1; then
  cat >/etc/yum.repos.d/mongodb-org-7.0.repo <<'REPO'
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
REPO
  dnf -y install mongodb-org >/dev/null
  # Bind to localhost only — no port opened publicly. Backend reaches it
  # via 127.0.0.1:27017.
  sed -i 's|^  bindIp:.*|  bindIp: 127.0.0.1|' /etc/mongod.conf || true
  systemctl enable --now mongod
fi

echo "==> Application user + directories"
if ! id "$APP_USER" >/dev/null 2>&1; then
  useradd -r -s /bin/bash -d "$APP_DIR" "$APP_USER"
fi
mkdir -p "$APP_DIR" "$APP_DIR/repo" "$APP_DIR/releases" "$APP_DIR/shared"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

echo "==> Firewall (open 80/443 only; SSH is handled by Hostinger)"
if systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-service=http >/dev/null 2>&1 || true
  firewall-cmd --permanent --add-service=https >/dev/null 2>&1 || true
  firewall-cmd --reload >/dev/null 2>&1 || true
fi

echo "==> SELinux — allow nginx to reverse-proxy the backend socket"
setsebool -P httpd_can_network_connect 1 || true

echo "==> systemd unit"
cat >/etc/systemd/system/tunemavens-backend.service <<UNIT
[Unit]
Description=TuneMavens FastAPI backend
After=network.target mongod.service

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR/repo/backend
EnvironmentFile=$APP_DIR/shared/backend.env
ExecStart=$APP_DIR/repo/backend/.venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
Restart=on-failure
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload

echo "==> nginx site config"
# Hostinger's built-in SSL sits in front of the VPS, so nginx listens plain
# HTTP on 80 for internal proxying. If HTTPS is terminated INSIDE the VPS
# (Let's Encrypt on the box), also drop in the 443 block automatically —
# certs at /etc/letsencrypt/live/$APP_DOMAIN/ trigger it.
NGX_CONF="/etc/nginx/conf.d/tunemavens.conf"
TEMP_NGX="/tmp/tunemavens_nginx.conf"

cat >"$TEMP_NGX" <<NGX
# ==============================================================================
# 1. Main Portal & Dashboard ($APP_DOMAIN)
# ==============================================================================
server {
  listen 80;
  server_name $APP_DOMAIN www.$APP_DOMAIN djs.$APP_DOMAIN labels.$APP_DOMAIN producers.$APP_DOMAIN mediahouses.$APP_DOMAIN;

  root $APP_DIR/dist/portal;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 60s;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location ~* \\.(?:css|js|woff2?|ttf|svg|png|jpe?g|webp|ico)\$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    try_files \$uri =404;
  }
}

# ==============================================================================
# 2. TuneStream Utility (tunestream.co & tunestream.tunemavens.com)
# ==============================================================================
server {
  listen 80;
  server_name tunestream.co www.tunestream.co tunestream.tunemavens.com;

  root $APP_DIR/dist/tunestream;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 60s;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location ~* \\.(?:css|js|woff2?|ttf|svg|png|jpe?g|webp|ico)\$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    try_files \$uri =404;
  }
}

# ==============================================================================
# 3. SyncMavens Utility (syncmavens.com)
# ==============================================================================
server {
  listen 80;
  server_name syncmavens.com www.syncmavens.com;

  root $APP_DIR/dist/syncmavens;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 60s;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location ~* \\.(?:css|js|woff2?|ttf|svg|png|jpe?g|webp|ico)\$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    try_files \$uri =404;
  }
}
NGX

CONFIG_CHANGED=false
if [ ! -f "$NGX_CONF" ] || ! diff -q "$TEMP_NGX" "$NGX_CONF" >/dev/null; then
  echo "==> Nginx configuration changed. Updating..."
  cp "$TEMP_NGX" "$NGX_CONF"
  CONFIG_CHANGED=true
else
  echo "==> Nginx configuration is up to date. No changes."
fi
rm -f "$TEMP_NGX"

nginx -t
systemctl enable --now nginx

if [ "$CONFIG_CHANGED" = true ]; then
  echo "==> Reloading nginx since configuration changed"
  systemctl reload nginx || systemctl restart nginx
fi

echo "==> Bootstrap complete."
