#!/usr/bin/env bash
# Резервное копирование БД и загруженных файлов сайта ГБПОУ РД «КИТ».
#
# Создаёт два артефакта с меткой времени в каталоге $BACKUP_DIR:
#   db-<ts>.dump      — дамп PostgreSQL (custom format, восстанавливается pg_restore)
#   uploads-<ts>.tgz  — содержимое тома загрузок (MEDIA_DIR)
#
# Запуск (из корня проекта, db поднята):  ./scripts/backup.sh
# Автоматизация: cron, напр.  15 3 * * *  /path/scripts/backup.sh >> /var/log/kit-backup.log 2>&1
set -euo pipefail

cd "$(dirname "$0")/.."

# Загружаем переменные окружения (POSTGRES_USER/POSTGRES_DB/POSTGRES_PASSWORD).
if [[ -f .env ]]; then set -a; . ./.env; set +a; fi

DB_CONTAINER="${DB_CONTAINER:-kit-postgres}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
UPLOADS_VOLUME="${UPLOADS_VOLUME:-kit-college_kit-uploads}"
TS="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Бэкап БД → $BACKUP_DIR/db-$TS.dump"
docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" "$DB_CONTAINER" \
  pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -Fc \
  > "$BACKUP_DIR/db-$TS.dump"

echo "[$(date)] Бэкап загрузок → $BACKUP_DIR/uploads-$TS.tgz"
docker run --rm \
  -v "${UPLOADS_VOLUME}:/data:ro" \
  -v "$(cd "$BACKUP_DIR" && pwd):/backup" \
  alpine:3.20 \
  tar czf "/backup/uploads-$TS.tgz" -C /data .

echo "[$(date)] Ротация: удаляю архивы старше ${RETENTION_DAYS} дней"
find "$BACKUP_DIR" -name 'db-*.dump' -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -name 'uploads-*.tgz' -mtime +"$RETENTION_DAYS" -delete

echo "[$(date)] Готово."
