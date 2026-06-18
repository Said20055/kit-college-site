import "server-only";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

/** Каталог хранения (вне webroot). По умолчанию ./var/uploads от корня проекта. */
export const MEDIA_DIR = process.env.MEDIA_DIR
  ? path.resolve(process.env.MEDIA_DIR)
  : path.join(process.cwd(), "var", "uploads");

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 МБ

export type MediaKind = "IMAGE" | "DOC";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const DOC_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

/** Определяет вид и расширение по MIME. null — тип не разрешён. */
export function classifyMime(mime: string): { kind: MediaKind; ext: string } | null {
  if (mime in IMAGE_TYPES) return { kind: "IMAGE", ext: IMAGE_TYPES[mime] };
  if (mime in DOC_TYPES) return { kind: "DOC", ext: DOC_TYPES[mime] };
  return null;
}

/** Абсолютный путь к файлу на диске. storageKey генерируется нами — без traversal. */
export function mediaFilePath(storageKey: string): string {
  return path.join(MEDIA_DIR, path.basename(storageKey));
}

/** Сохраняет буфер на диск под сгенерированным именем. Возвращает ключ и checksum. */
export async function saveBuffer(
  buffer: Buffer,
  ext: string,
): Promise<{ storageKey: string; checksum: string }> {
  await mkdir(MEDIA_DIR, { recursive: true });
  const checksum = createHash("sha256").update(buffer).digest("hex");
  const storageKey = `${checksum.slice(0, 16)}-${Date.now().toString(36)}.${ext}`;
  await writeFile(mediaFilePath(storageKey), buffer);
  return { storageKey, checksum };
}

export async function deleteStoredFile(storageKey: string): Promise<void> {
  try {
    await unlink(mediaFilePath(storageKey));
  } catch {
    // Файла уже нет — не считаем ошибкой.
  }
}
