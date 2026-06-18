"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logAudit } from "@/lib/auth/audit";
import { deleteStoredFile } from "@/lib/media";

export async function deleteMediaAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const media = await prisma.mediaFile.findUnique({ where: { id } });
  if (!media) return;

  // Связанные обложки новостей обнуляются автоматически (onDelete: SetNull).
  await prisma.mediaFile.delete({ where: { id } });
  await deleteStoredFile(media.storageKey);

  await logAudit({
    actorId: user.id,
    action: "media.delete",
    entityType: "MediaFile",
    entityId: id,
    summary: media.originalName,
  });

  revalidatePath("/admin/media");
  revalidateTag("news", { expire: 0 }); // если файл был обложкой новости
}
