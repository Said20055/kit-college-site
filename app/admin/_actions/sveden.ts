"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth/dal";
import { logAudit } from "@/lib/auth/audit";
import { ENTITIES, type EntityKey, type Field } from "../sveden/_fields";

/** Минимальный интерфейс делегата Prisma, достаточный для генерик-CRUD. */
type Delegate = {
  create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>;
  update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
  findUnique: (args: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
  count: () => Promise<number>;
};

const DELEGATES = {
  document: prisma.document,
  program: prisma.program,
  structUnit: prisma.structUnit,
  governanceBody: prisma.governanceBody,
  manager: prisma.manager,
  teacher: prisma.teacher,
  mtbItem: prisma.mtbItem,
  ovzCondition: prisma.ovzCondition,
  stipend: prisma.stipend,
  navItem: prisma.navItem,
  statItem: prisma.statItem,
  advantage: prisma.advantage,
} as unknown as Record<EntityKey, Delegate>;

/** Сброс кэша публичных страниц без передеплоя — по тегам контента. */
function revalidateContent(tags: string[]): void {
  for (const t of tags) revalidateTag(t, { expire: 0 });
  if (tags.includes("sveden")) {
    revalidatePath("/sveden");
    revalidatePath("/sveden/[section]", "page");
  }
  if (tags.includes("programs")) {
    revalidatePath("/sveden/[section]", "page");
    revalidatePath("/abiturient");
    revalidatePath("/");
  }
  if (tags.includes("home")) revalidatePath("/");
  // Шапка/подвал и метаданные используют профиль и меню — обновляем весь layout.
  if (tags.includes("nav") || tags.includes("college")) revalidatePath("/", "layout");
}

/** FormData → объект данных Prisma с приведением типов по описанию полей. */
function buildData(fields: Field[], formData: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = formData.get(f.name);
    if (f.type === "int") {
      const n = Math.trunc(Number(raw));
      data[f.name] = Number.isFinite(n) ? n : 0;
    } else if (f.type === "bool") {
      data[f.name] = raw === "on" || raw === "true";
    } else {
      const s = typeof raw === "string" ? raw.trim() : "";
      data[f.name] = f.nullable && s === "" ? null : s;
    }
  }
  return data;
}

function isUniqueError(e: unknown): boolean {
  return (
    typeof e === "object" && e !== null && "code" in e && (e as { code: unknown }).code === "P2002"
  );
}

function titleOf(cfg: (typeof ENTITIES)[EntityKey], data: Record<string, unknown>): string {
  const v = data[cfg.titleField];
  return typeof v === "string" && v ? v : "—";
}

export async function createEntity(
  key: EntityKey,
  redirectPath: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const cfg = ENTITIES[key];
  const delegate = DELEGATES[key];
  const data = buildData(cfg.fields, formData);

  // Авто-порядок: 0 → добавить в конец списка.
  if ("order" in data && data.order === 0) {
    data.order = await delegate.count();
  }

  try {
    const created = await delegate.create({ data });
    await logAudit({
      actorId: user.id,
      action: "sveden.create",
      entityType: key,
      entityId: created.id,
      summary: `${cfg.label}: ${titleOf(cfg, data)}`,
    });
  } catch (e) {
    if (isUniqueError(e)) {
      redirect(`${redirectPath}?error=${encodeURIComponent("Запись с таким уникальным полем уже существует")}`);
    }
    throw e;
  }

  revalidateContent(cfg.tags);
}

export async function updateEntity(
  key: EntityKey,
  redirectPath: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const cfg = ENTITIES[key];
  const delegate = DELEGATES[key];
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const data = buildData(cfg.fields, formData);

  try {
    await delegate.update({ where: { id }, data });
    await logAudit({
      actorId: user.id,
      action: "sveden.update",
      entityType: key,
      entityId: id,
      summary: `${cfg.label}: ${titleOf(cfg, data)}`,
    });
  } catch (e) {
    if (isUniqueError(e)) {
      redirect(`${redirectPath}?error=${encodeURIComponent("Запись с таким уникальным полем уже существует")}`);
    }
    throw e;
  }

  revalidateContent(cfg.tags);
}

export async function deleteEntity(
  key: EntityKey,
  _redirectPath: string,
  formData: FormData,
): Promise<void> {
  const user = await requireUser();
  const cfg = ENTITIES[key];
  const delegate = DELEGATES[key];
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const existing = await delegate.findUnique({ where: { id } });
  await delegate.delete({ where: { id } });
  await logAudit({
    actorId: user.id,
    action: "sveden.delete",
    entityType: key,
    entityId: id,
    summary: `${cfg.label}: ${existing ? titleOf(cfg, existing) : id}`,
  });

  revalidateContent(cfg.tags);
}

// ─── Финансы (singleton) ──────────────────────────────────────────────────

export async function updateFinancesAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const data = {
    year: String(formData.get("year") ?? "").trim(),
    budgetVolume: String(formData.get("budgetVolume") ?? "").trim(),
    income: String(formData.get("income") ?? "").trim(),
    spending: String(formData.get("spending") ?? "").trim(),
    planHref: String(formData.get("planHref") ?? "").trim(),
  };
  await prisma.finances.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
  await logAudit({
    actorId: user.id,
    action: "sveden.finances",
    entityType: "Finances",
    entityId: "singleton",
    summary: `Финансово-хозяйственная деятельность (${data.year})`,
  });
  revalidateContent(["sveden"]);
}

// ─── Конфигурация подразделов ─────────────────────────────────────────────

export async function updateSectionAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  if (!slug) return;
  const title = String(formData.get("title") ?? "").trim();
  const short = String(formData.get("short") ?? "").trim();
  const introRaw = String(formData.get("intro") ?? "").trim();
  const orderRaw = Math.trunc(Number(formData.get("order")));
  await prisma.svedenSection.update({
    where: { slug },
    data: {
      title,
      short,
      order: Number.isFinite(orderRaw) ? orderRaw : 0,
      isEnabled: formData.get("isEnabled") === "on",
      intro: introRaw === "" ? null : introRaw,
    },
  });
  await logAudit({
    actorId: user.id,
    action: "sveden.section",
    entityType: "SvedenSection",
    entityId: slug,
    summary: `Подраздел: ${title || slug}`,
  });
  revalidateContent(["sveden"]);
}

// ─── Профиль организации (singleton: реквизиты, руководитель, контакты) ─────

export async function updateProfileAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const g = (k: string) => String(formData.get(k) ?? "").trim();
  const data = {
    shortName: g("shortName"),
    abbr: g("abbr"),
    fullName: g("fullName"),
    tagline: g("tagline"),
    description: g("description"),
    founded: g("founded"),
    inn: g("inn"),
    kpp: g("kpp"),
    ogrn: g("ogrn"),
    founder: g("founder"),
    founderUrl: g("founderUrl"),
    directorName: g("directorName"),
    directorPost: g("directorPost"),
    directorReceptionTime: g("directorReceptionTime"),
    directorPhone: g("directorPhone"),
    directorEmail: g("directorEmail"),
    address: g("address"),
    addressShort: g("addressShort"),
    phone: g("phone"),
    phoneHref: g("phoneHref"),
    email: g("email"),
    workTime: g("workTime"),
    mapCoords: g("mapCoords"),
  };
  await prisma.collegeProfile.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
  await logAudit({
    actorId: user.id,
    action: "profile.update",
    entityType: "CollegeProfile",
    entityId: "singleton",
    summary: data.shortName || data.fullName,
  });
  // Профиль участвует в шапке/подвале/метаданных и в hero на главной.
  revalidateContent(["college", "home"]);
}
