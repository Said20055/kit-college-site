import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Выключает режим предпросмотра и возвращает в админку. */
export async function GET() {
  (await draftMode()).disable();
  redirect("/admin/news");
}
