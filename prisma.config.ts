import "dotenv/config";
import { defineConfig, env } from "prisma/config";

type Env = { DATABASE_URL: string };

// Prisma 7: URL подключения для Migrate/Studio задаётся здесь, а не в schema.prisma.
// Рантайм-подключение (PrismaClient) использует driver adapter — см. lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env<Env>("DATABASE_URL"),
  },
});
