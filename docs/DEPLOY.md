# Развёртывание сайта ГБПОУ РД «КИТ»

Самостоятельный хостинг на сервере в РФ (152-ФЗ). Стек: Next.js (standalone) +
PostgreSQL + nginx, оркестрация — `docker-compose.prod.yml`. Vercel/статический
экспорт не используются.

## 1. Требования

- VPS/сервер в РФ, Linux (Ubuntu 22.04+/Debian 12+), ≥ 2 vCPU, ≥ 2 ГБ RAM, ≥ 20 ГБ диск.
- Docker Engine 24+ и плагин `docker compose` v2.
- Доменное имя, A/AAAA-записи указывают на сервер.
- Открыты порты 80 и 443.

## 2. Подготовка

```bash
git clone <repo> /opt/kit-college && cd /opt/kit-college
cp .env.production.example .env
# Отредактируйте .env: задайте надёжные пароли БД и администратора,
# подставьте их в DATABASE_URL и BUILD_DATABASE_URL.
nano .env
```

В `deploy/nginx/kit.conf` замените `kit-college.ru` на ваш домен.

### TLS-сертификаты

Положите сертификаты в `deploy/nginx/certs/` как `fullchain.pem` и `privkey.pem`.
Через Let's Encrypt (certbot, webroot `deploy/nginx/acme`):

```bash
mkdir -p deploy/nginx/certs deploy/nginx/acme
# Поднимите nginx после первичного развёртывания, затем:
docker run --rm -v "$PWD/deploy/nginx/certs:/etc/letsencrypt/live/kit" \
  -v "$PWD/deploy/nginx/acme:/var/www/acme" certbot/certbot certonly \
  --webroot -w /var/www/acme -d kit-college.ru -d www.kit-college.ru
```

## 3. Первичное развёртывание

> Сборка `web` пререндерит страницы, читающие БД, поэтому БД должна быть поднята
> и мигрирована **до** сборки. Build выполняется в сети хоста и обращается к
> опубликованной на `127.0.0.1:5432` базе (см. `BUILD_DATABASE_URL`).

```bash
C="docker compose -f docker-compose.prod.yml"

# 1) База данных
$C up -d db

# 2) Миграции (идемпотентно)
$C run --rm migrate

# 3) Первичное наполнение контентом — ТОЛЬКО при первой установке!
#    seed очищает контентные таблицы; на работающем сайте НЕ запускать.
$C run --rm migrate npx tsx prisma/seed.ts

# 4) Сборка и запуск веб-приложения и прокси
$C build web
$C up -d
```

Проверка: `curl -fsS https://kit-college.ru/api/health` → `{"status":"ok",...}`.
Вход в админку: `https://kit-college.ru/admin` (логин/пароль из `.env`).
**Сразу смените пароль администратора** в разделе «Мой профиль».

## 4. Обновление кода (передеплой)

```bash
C="docker compose -f docker-compose.prod.yml"
git pull
$C run --rm migrate          # применить новые миграции (если есть)
$C build web                 # db должна быть поднята (пререндер)
$C up -d
```

`seed` при обновлении **не запускается** — контент сохраняется.

## 5. Изменение контента

Через `/admin` — новости, «Сведения», профиль, меню, медиатека. Изменения
появляются на сайте без передеплоя (ISR + `revalidateTag`/`revalidatePath`).
Передеплой нужен только при изменении кода.

## 6. Резервное копирование

```bash
./scripts/backup.sh          # db-<ts>.dump + uploads-<ts>.tgz в ./backups
```

Cron (ежедневно в 03:15):

```cron
15 3 * * * cd /opt/kit-college && ./scripts/backup.sh >> /var/log/kit-backup.log 2>&1
```

Восстановление:

```bash
./scripts/restore.sh ./backups/db-<ts>.dump ./backups/uploads-<ts>.tgz
docker compose -f docker-compose.prod.yml restart web
```

Регулярно копируйте каталог `./backups` на отдельный носитель/в защищённое
хранилище в РФ.

## 7. Обслуживание

```bash
C="docker compose -f docker-compose.prod.yml"
$C ps                 # статус сервисов
$C logs -f web        # логи приложения
$C logs -f nginx      # логи прокси
$C restart web        # перезапуск
$C down               # остановить стек (данные в томах сохраняются)
```

Журнал действий администраторов доступен в `/admin/audit`.

## 8. Замечания

- Том загрузок `kit-uploads` смонтирован в `/app/var/uploads` (вне webroot,
  файлы отдаёт защищённый маршрут `/media/[id]`). Включайте его в бэкапы.
- Порт PostgreSQL опубликован только на `127.0.0.1` (нужно для сборки и бэкапов),
  извне недоступен.
- Перед публичным запуском см. чек-лист в [SECURITY.md](SECURITY.md): реальные
  реквизиты, проверка микроразметки официальным парсером, секреты, политика ПДн.
