# Intermaven & TuneMavens Ecosystem — VPS Deployment Guide

This guide covers deploying **Intermaven** (`intermaven.io`), **TuneMavens Portal** (`tunemavens.com`), **TuneStream** (`tunestream.co`), **SyncMavens** (`syncmavens.com`), the **FastAPI Backend + Admin Console** (`8001`), and the **Express API** (`5000`) onto a fresh Ubuntu/Debian VPS using Docker Compose and Nginx.

---

## 1. VPS Prerequisites

- Ubuntu 22.04+ / Debian 12+ with at least **2 vCPU, 4 GB RAM, 40 GB SSD**.
- DNS `A` records pointing to your VPS public IP for:
  - `intermaven.io` & `www.intermaven.io`
  - `tunemavens.com` & `www.tunemavens.com`
  - `tunestream.co` & `www.tunestream.co`
  - `syncmavens.com` & `www.syncmavens.com`
- Docker Engine (`docker compose` plugin), Node.js 20+, and Git installed on the VPS.

---

## 2. Clone Repositories & Configure Secrets

```bash
# On the VPS:
sudo mkdir -p /opt && cd /opt
git clone <tunemavens-repo-url> tunemavens
git clone <intermaven-repo-url> intermaven

cd /opt/tunemavens
cp deploy/vps/.env.production.template deploy/vps/.env.production
nano deploy/vps/.env.production
```

Set `INTERMAVEN_DIST_PATH=/opt/intermaven` (or `/opt/intermaven/frontend/build` if deploying the React build) along with your live `JWT_SECRET`, `RESEND_API_KEY`, Stripe, and M-Pesa credentials.

---

## 3. Build & Launch Containers

```bash
cd /opt/tunemavens
chmod +x deploy/vps/deploy.sh
./deploy/vps/deploy.sh
```

This script:
1. Installs Node workspace dependencies and builds `apps/portal/dist`, `apps/tunestream/dist`, and `apps/syncmavens/dist`.
2. Builds and starts `intermaven_mongo`, `intermaven_backend` (FastAPI `8001`), `intermaven_express_api` (Express `5000`), and `intermaven_nginx` (ports `80`/`443`).
3. Verifies `http://127.0.0.1:8001/health`.

---

## 4. Enable HTTPS (Let's Encrypt SSL)

Once DNS propagation completes, issue certificates for all four domains:

```bash
sudo apt-get install -y certbot
sudo certbot certonly --webroot -w /var/www/certbot \
  -d intermaven.io -d www.intermaven.io \
  -d tunemavens.com -d www.tunemavens.com \
  -d tunestream.co -d www.tunestream.co \
  -d syncmavens.com -d www.syncmavens.com
```

Then enable SSL server blocks (`listen 443 ssl;`) in `deploy/vps/nginx/intermaven.conf` and reload Nginx:

```bash
docker compose -f deploy/vps/docker-compose.prod.yml restart nginx
```
