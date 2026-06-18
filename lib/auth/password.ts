import { argon2id, argon2Verify } from "hash-wasm";
import { randomBytes } from "node:crypto";

// argon2id — без нативной сборки (чистый WASM). Параметры по рекомендациям OWASP:
// memorySize 19 МиБ (19456 КиБ), iterations 2, parallelism 1.
const PARAMS = {
  parallelism: 1,
  iterations: 2,
  memorySize: 19456,
  hashLength: 32,
} as const;

/** Возвращает закодированный argon2id-хеш (с солью и параметрами внутри). */
export async function hashPassword(password: string): Promise<string> {
  return argon2id({
    password,
    salt: randomBytes(16),
    outputType: "encoded",
    ...PARAMS,
  });
}

/** Проверяет пароль против закодированного хеша. Любая ошибка разбора → false. */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await argon2Verify({ password, hash });
  } catch {
    return false;
  }
}
