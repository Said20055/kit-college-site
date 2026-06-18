import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { getCollege, type College } from "@/lib/data/college";
import {
  getEduPrograms,
  getVacantPlaces,
  getFgosLinks,
  type EduProgram,
  type VacantPlace,
  type FgosLink,
} from "@/lib/data/programs";

export type DocItem = { title: string; note?: string; href: string };
export type SvedenSectionMeta = { slug: string; title: string; short: string; intro: string | null };
type Manager = { name: string; post: string; phone: string; email: string };
type StructUnitView = {
  name: string;
  head: string;
  post: string;
  address: string;
  site: string;
  email: string;
  position: string;
};
type TeacherView = {
  fio: string;
  post: string;
  disciplines: string;
  eduLevel: string;
  qualification: string;
  degree: string;
  academicStatus: string;
  retraining: string;
  qualImprovement: string;
  generalExp: string;
  specialExp: string;
  programs: string;
};
type FinancesView = {
  year: string;
  budgetVolume: string;
  income: string;
  spending: string;
  planHref: string;
};

/** Полный набор данных для рендера подразделов «Сведения» (см. components/sveden/content.tsx). */
export type SvedenData = {
  college: College;
  leadership: Manager[];
  documents: DocItem[];
  licenseDocs: DocItem[];
  paidEduDocs: DocItem[];
  structUnits: StructUnitView[];
  governanceBodies: string[];
  teachers: TeacherView[];
  eduPrograms: EduProgram[];
  vacantPlaces: VacantPlace[];
  fgosLinks: FgosLink[];
  mtbItems: { title: string; value: string }[];
  ovzConditions: string[];
  stipends: string[];
  finances: FinancesView;
};

const loadSections = unstable_cache(
  async (): Promise<SvedenSectionMeta[]> => {
    const rows = await prisma.svedenSection.findMany({
      where: { isEnabled: true },
      orderBy: { order: "asc" },
    });
    return rows.map((s) => ({ slug: s.slug, title: s.title, short: s.short, intro: s.intro }));
  },
  ["sveden-sections"],
  { tags: ["sveden"], revalidate: 3600 },
);

export const getSvedenSections = cache(loadSections);

export const getSvedenSectionMeta = cache(
  async (slug: string): Promise<SvedenSectionMeta | null> => {
    const sections = await getSvedenSections();
    return sections.find((s) => s.slug === slug) ?? null;
  },
);

const loadSvedenTables = unstable_cache(
  async () => {
    const [docs, structUnits, governance, managers, teachers, mtb, ovz, stipends, finances] =
      await Promise.all([
        prisma.document.findMany({ orderBy: { order: "asc" } }),
        prisma.structUnit.findMany({ orderBy: { order: "asc" } }),
        prisma.governanceBody.findMany({ orderBy: { order: "asc" } }),
        prisma.manager.findMany({ orderBy: { order: "asc" } }),
        prisma.teacher.findMany({ orderBy: { order: "asc" } }),
        prisma.mtbItem.findMany({ orderBy: { order: "asc" } }),
        prisma.ovzCondition.findMany({ orderBy: { order: "asc" } }),
        prisma.stipend.findMany({ orderBy: { order: "asc" } }),
        prisma.finances.findUnique({ where: { id: "singleton" } }),
      ]);

    // Ссылка на скачивание: если документ привязан к файлу медиатеки — отдаём через
    // /media/<id>; иначе используем заданный вручную href (внешняя ссылка/заглушка).
    const mapDoc = (d: (typeof docs)[number]): DocItem => ({
      title: d.title,
      note: d.note ?? undefined,
      href: d.fileId ? `/media/${d.fileId}` : d.href,
    });

    return {
      documents: docs.filter((d) => d.category === "GENERAL").map(mapDoc),
      licenseDocs: docs.filter((d) => d.category === "LICENSE").map(mapDoc),
      paidEduDocs: docs.filter((d) => d.category === "PAID_EDU").map(mapDoc),
      structUnits: structUnits.map((u) => ({
        name: u.name,
        head: u.head,
        post: u.post,
        address: u.address,
        site: u.site,
        email: u.email,
        position: u.positionHref,
      })),
      governanceBodies: governance.map((g) => g.name),
      leadership: managers.map((m) => ({
        name: m.name,
        post: m.post,
        phone: m.phone,
        email: m.email,
      })),
      teachers: teachers.map((t) => ({
        fio: t.fio,
        post: t.post,
        disciplines: t.disciplines,
        eduLevel: t.eduLevel,
        qualification: t.qualification,
        degree: t.degree,
        academicStatus: t.academicStatus,
        retraining: t.retraining,
        qualImprovement: t.qualImprovement,
        generalExp: t.generalExp,
        specialExp: t.specialExp,
        programs: t.programs,
      })),
      mtbItems: mtb.map((m) => ({ title: m.title, value: m.value })),
      ovzConditions: ovz.map((c) => c.text),
      stipends: stipends.map((s) => s.text),
      finances: finances
        ? {
            year: finances.year,
            budgetVolume: finances.budgetVolume,
            income: finances.income,
            spending: finances.spending,
            planHref: finances.planHref,
          }
        : { year: "", budgetVolume: "", income: "", spending: "", planHref: "" },
    };
  },
  ["sveden-tables"],
  { tags: ["sveden", "programs", "college"], revalidate: 3600 },
);

export const getSvedenData = cache(async (): Promise<SvedenData> => {
  const [college, tables, eduPrograms, vacantPlaces, fgosLinks] = await Promise.all([
    getCollege(),
    loadSvedenTables(),
    getEduPrograms(),
    getVacantPlaces(),
    getFgosLinks(),
  ]);
  return { college, eduPrograms, vacantPlaces, fgosLinks, ...tables };
});
