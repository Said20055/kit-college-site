import { readFile } from "node:fs/promises";
import { prisma } from "@/lib/db";
import { mediaFilePath } from "@/lib/media";

/** Отдаёт медиафайл с диска по его id. Публично (документы и изображения сайта). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const media = await prisma.mediaFile.findUnique({ where: { id } });
  if (!media) return new Response("Файл не найден", { status: 404 });

  let buf: Buffer;
  try {
    buf = await readFile(mediaFilePath(media.storageKey));
  } catch {
    return new Response("Файл не найден", { status: 404 });
  }

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": media.mimeType,
      "Content-Length": String(media.sizeBytes),
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(media.originalName)}`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
