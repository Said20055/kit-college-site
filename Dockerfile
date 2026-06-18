# syntax=docker/dockerfile:1.7
# Многоступенчатая сборка сайта ГБПОУ РД «КИТ».
# Рантайм — self-hosted Node (output: "standalone"), без Vercel.

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ── deps: установка зависимостей + генерация Prisma Client (postinstall) ──────
FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# Для npm ci / prisma generate подключение к БД не требуется — ставим заглушку,
# чтобы env() в prisma.config.ts не падал при загрузке.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npm ci

# ── builder: сборка приложения (пререндер БД-страниц требует доступной БД) ────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate && npm run build

# ── migrator: применение миграций в рантайме (отдельный one-off сервис) ───────
FROM base AS migrator
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# По умолчанию — безопасное применение миграций. Сидирование запускается
# вручную и только при первой установке (см. DEPLOY.md): seed чистит контент.
CMD ["npx", "prisma", "migrate", "deploy"]

# ── runner: минимальный продакшен-образ ──────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Непривилегированный пользователь.
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs

# Standalone-сервер + статика + публичные ассеты.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Каталог загрузок (монтируется как том, MEDIA_DIR=/app/var/uploads).
RUN mkdir -p /app/var/uploads && chown -R nextjs:nodejs /app/var

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
