# Deploying the website

The site runs on the Superflats server in Docker, behind nginx, as `https://superflats.in`. It talks to the
Express API at `https://api.superflats.in/api`.

| | |
|---|---|
| Container | `superflats-web` (Next.js standalone server, non-root) |
| Port | `127.0.0.1:3002` on the server only; nginx publishes it |
| Folder on the server | `~/super-flats/super-flats-web` (a clone of this repo) |

## Settings

`.env` next to `docker-compose.yml` (git-ignored):

```bash
NEXT_PUBLIC_SITE_URL=https://superflats.in
NEXT_PUBLIC_SUPPORT_EMAIL=support@superflats.in
NEXT_PUBLIC_LEGAL_NAME=Superflats
SUPERFLATS_API_URL=https://api.superflats.in/api
```

`NEXT_PUBLIC_*` values are built into the browser code, so changing them needs a rebuild
(`docker compose up -d --build`). `SUPERFLATS_API_URL` is read at runtime; a restart is enough.

Password-reset emails link to `<WEB_APP_URL>/reset-password`, so the backend's `.env` needs
`WEB_APP_URL=https://superflats.in`.

## First deploy

1. **DNS:** point `superflats.in` and `www.superflats.in` (A records) to the server's IP. Remove the old GitHub
   Pages records.
2. **Swap:** `next build` needs 1–2 GB of memory. On a small server, add swap first so the build can't push other
   apps out of memory:
   ```bash
   fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
   echo '/swapfile none swap sw 0 0' >> /etc/fstab
   ```
3. **Code and settings:**
   ```bash
   cd ~/super-flats
   git clone git@<github host alias>:mkhan777717/SuperFlats-FE-Web.git super-flats-web
   cd super-flats-web && nano .env    # the settings above
   ```
4. **Build and start** (the first build takes several minutes on one CPU):
   ```bash
   docker compose up -d --build
   docker compose logs -f web          # wait for "Ready", then Ctrl+C
   curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3002/   # 200
   ```
5. **nginx and HTTPS:**
   ```bash
   cp deploy/nginx-superflats.in.conf /etc/nginx/sites-available/superflats.in
   ln -s /etc/nginx/sites-available/superflats.in /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   certbot --nginx -d superflats.in -d www.superflats.in
   ```

## Updating

```bash
cd ~/super-flats/super-flats-web
git pull --ff-only && docker compose up -d --build
docker image prune -f        # removes the previous image
```
The old container keeps serving until the new image is built, then it's swapped in a few seconds.

## Day to day

| Do | Command |
|---|---|
| Status | `docker compose ps` |
| Logs | `docker compose logs -f web` |
| Restart | `docker compose restart web` |
| Roll back | `git checkout <older commit> && docker compose up -d --build` |
