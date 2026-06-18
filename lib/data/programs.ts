import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/db";

export type Specialty = {
  code: string;
  name: string;
  qualification: string;
  forms: string;
  duration: string;
  group: string;
};

export type EduProgram = {
  code: string;
  name: string;
  level: string;
  form: string;
  duration: string;
  budget: number;
  paid: number;
  foreign: number;
  accredited: boolean;
};

export type VacantPlace = {
  code: string;
  name: string;
  budgetVacant: number;
  paidVacant: number;
};

export type FgosLink = { code: string; name: string; href: string };

const loadPrograms = unstable_cache(
  async () => {
    return prisma.program.findMany({ orderBy: { order: "asc" } });
  },
  ["programs-all"],
  { tags: ["programs"], revalidate: 3600 },
);

/** Специальности для маркетинговых блоков (главная, /abiturient). */
export const getSpecialties = cache(async (): Promise<Specialty[]> => {
  const rows = await loadPrograms();
  return rows
    .filter((p) => p.isMarketing)
    .map((p) => ({
      code: p.code,
      name: p.name,
      qualification: p.qualification,
      forms: p.forms,
      duration: p.duration,
      group: p.group,
    }));
});

/** Реализуемые программы и численность (раздел «Образование»). */
export const getEduPrograms = cache(async (): Promise<EduProgram[]> => {
  const rows = await loadPrograms();
  return rows.map((p) => ({
    code: p.code,
    name: p.name,
    level: p.level,
    form: p.forms,
    duration: p.duration,
    budget: p.budgetPlaces,
    paid: p.paidPlaces,
    foreign: p.foreignPlaces,
    accredited: p.accredited,
  }));
});

/** Вакантные места (раздел «Вакантные места для приёма»). */
export const getVacantPlaces = cache(async (): Promise<VacantPlace[]> => {
  const rows = await loadPrograms();
  return rows.map((p) => ({
    code: p.code,
    name: p.name,
    budgetVacant: p.budgetVacant,
    paidVacant: p.paidVacant,
  }));
});

/** Ссылки на ФГОС (раздел «Образовательные стандарты»). */
export const getFgosLinks = cache(async (): Promise<FgosLink[]> => {
  const rows = await loadPrograms();
  return rows.map((p) => ({ code: p.code, name: p.name, href: p.fgosHref }));
});
