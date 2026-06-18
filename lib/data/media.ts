import "server-only";
import { prisma } from "@/lib/db";

export type MediaItem = {
  id: string;
  kind: "IMAGE" | "DOC";
  title: string | null;
  alt: string | null;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  url: string;
  createdAt: Date;
};

/** Список медиафайлов (для админки). Без кэша — нужны свежие данные. */
export async function getMediaList(kind?: "IMAGE" | "DOC"): Promise<MediaItem[]> {
  const rows = await prisma.mediaFile.findMany({
    where: kind ? { kind } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((m) => ({
    id: m.id,
    kind: m.kind,
    title: m.title,
    alt: m.alt,
    originalName: m.originalName,
    mimeType: m.mimeType,
    sizeBytes: m.sizeBytes,
    width: m.width,
    height: m.height,
    url: `/media/${m.id}`,
    createdAt: m.createdAt,
  }));
}
