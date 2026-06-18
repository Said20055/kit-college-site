import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Сознательно НЕ используем nonce/strict-dynamic: по документации Next они
 * принудительно переводят все страницы в динамический рендер, что отключает
 * статическую генерацию и ISR — а на них держится требование «правки видны
 * без передеплоя» (revalidateTag/revalidatePath). Поэтому статически
 * совместимый вариант: 'self' + 'unsafe-inline' (нужен для inline-скрипта
 * доступности в layout, инлайновых стилей next/image и motion).
 * Сторонние скрипты/домены не подключаются — поверхность XSS минимальна,
 * а единственный пользовательский HTML (тело новости) проходит sanitize-html.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self'",
  "manifest-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // HSTS действует только поверх HTTPS; браузеры игнорируют его по HTTP.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig: NextConfig = {
  // Самостоятельный сервер для контейнера: .next/standalone/server.js
  // (без установки node_modules в рантайме). Деплой — на собственный Node в РФ.
  output: "standalone",
  // Не раскрываем стек: убираем заголовок X-Powered-By.
  poweredByHeader: false,
  images: {
    // WebP: на ~25% легче JPEG, быстрое кодирование, универсальная поддержка.
    // AVIF намеренно отключён — его кодировщик в текущем окружении зависает,
    // а выигрыш в размере не оправдывает риск зависания рантайм-оптимизации.
    formats: ["image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
