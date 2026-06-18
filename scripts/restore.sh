#!/usr/bin/env bash
# Восстановление БД и загрузок сайта ГБПОУ РД «КИТ» из бэкапа scripts/backup.sh.
#
# Использование:
#   ./scripts/restore.sh ./backups/db-<ts>.dump [./backups/uploads-<ts>.tgz]
#
# ВНИМАНИЕ: перезаписывает текущие данные. Перед запуском сделайте свежий бэкап.
set -euo pipefail

cd "$(dirname "$0")/.."
if [[ -f .env ]]; then set -a; . ./.env; set +a; fi

DB_CONTAINER="${DB_CONTAINER:-kit-postgres}"
UPLOADS_VOLUME="${UPLOADS_VOLUME:-kit-college_kit-uploads}"

DB_DUMP="${1:-}"
UPLOADS_TGZ="${2:-}"

if [[ -z "$DB_DUMP" || ! -f "$DB_DUMP" ]]; then
  echo "Укажите файл дампа БД: ./scripts/restore.sh ./backups/db-<ts>.dump [uploads-<ts>.tgz]" >&2
  exit 1
fi

read -r -p "Восстановить БД из $DB_DUMP, перезаписав текущие данные? [y/N] " ans
[[ "$ans" == "y" || "$ans" == "Y" ]] || { echo "Отменено."; exit 0; }

echo "[$(date)] Восстановление БД из $DB_DUMP"
docker exec -i -e PGPASSWORD="${POSTGRES_PASSWORD}" "$DB_CONTAINER" \
  pg_restore -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" --clean --if-exists --no-owner \
  < "$DB_DUMP"

if [[ -n "$UPLOADS_TGZ" && -f "$UPLOADS_TGZ" ]]; then
  echo "[$(date)] Восстановление загрузок из $UPLOADS_TGZ"
  docker run --rm \
    -v "${UPLOADS_VOLUME}:/data" \
    -v "$(cd "$(dirname "$UPLOADS_TGZ")" && pwd):/backup:ro" \
    alpine:3.20 \
    sh -c "rm -rf /data/* && tar xzf /backup/$(basename "$UPLOADS_TGZ") -C /data"
fi

echo "[$(date)] Готово. Перезапустите web: docker compose -f docker-compose.prod.yml restart web"
