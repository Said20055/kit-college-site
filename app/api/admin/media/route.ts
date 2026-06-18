import { NextResponse } from "next/server";
import { imageSize } from "image-size";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/dal";
import { logAudit } from "@/lib/auth/audit";
import { classifyMime, saveBuffer, MAX_UPLOAD_BYTES } from "@/lib/media";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const title = (form.get("title") as string)?.trim() || null;
  const alt = (form.get("alt") as string)?.trim() || null;

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Файл больше 25 МБ" }, { status: 413 });
  }

  const cls = classifyMime(file.type);
  if (!cls) {
    return NextResponse.json(
      { error: `Недопустимый тип файла: ${file.type || "неизвестно"}` },
      { status: 415 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let width: number | null = null;
  let height: number | null = null;
  if (cls.kind === "IMAGE") {
    try {
      const dim = imageSize(buffer);
      width = dim.width ?? null;
      height = dim.height ?? null;
    } catch {
      // не удалось прочитать размеры — не критично
    }
  }

  const { storageKey, checksum } = await saveBuffer(buffer, cls.ext);

  const media = await prisma.mediaFile.create({
    data: {
      kind: cls.kind,
      title,
      alt,
      originalName: file.name,
      storageKey,
      mimeType: file.type,
      sizeBytes: file.size,
      width,
      height,
      checksum,
      uploadedById: user.id,
    },
  });

  await logAudit({
    actorId: user.id,
    action: "media.upload",
    entityType: "MediaFile",
    entityId: media.id,
    summary: `${file.name} (${cls.kind})`,
  });

  return NextResponse.json({ id: media.id, kind: media.kind, url: `/media/${media.id}` });
}
