# TCM Frontend Deployment SOP

Safety rule: never restart PM2 before a successful build exists.

## Normal deploy

```bash
cd /var/www/tcm-frontend
git fetch origin master
git status --short
git pull --ff-only origin master
npm ci
npm run build
pm2 restart tcm-frontend --update-env
curl -sSI --max-time 10 https://tcm.my.id | head
pm2 describe tcm-frontend
```

## Pre-deploy checks

```bash
git status --short
test -f .next/BUILD_ID && cat .next/BUILD_ID
pm2 describe tcm-frontend
curl -sSI --max-time 10 https://tcm.my.id | head
```

If `git status --short` is not clean, stop and audit before pulling.

## Safe rebuild without code pull

```bash
cd /var/www/tcm-frontend
tar -czf /home/ubuntu/safety-backups/tcm-frontend-next-$(date +%Y%m%d-%H%M%S).tar.gz .next package.json package-lock.json
npm run build
pm2 restart tcm-frontend --update-env
curl -sSI --max-time 10 https://tcm.my.id | head
```

## Rollback from git

```bash
cd /var/www/tcm-frontend
git log --oneline -5
git reset --hard <GOOD_COMMIT>
npm ci
npm run build
pm2 restart tcm-frontend --update-env
curl -sSI --max-time 10 https://tcm.my.id | head
```

## Health verification

Expected:
- `https://tcm.my.id` returns HTTP 200.
- `pm2 describe tcm-frontend` status is `online`.
- restart count does not keep increasing.
- PM2 error log mtime does not update with fresh errors.

```bash
pm2 describe tcm-frontend
tail -80 /home/ubuntu/.pm2/logs/tcm-frontend-error.log
stat -c %y %s /home/ubuntu/.pm2/logs/tcm-frontend-error.log
```
