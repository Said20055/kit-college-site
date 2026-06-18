import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/db";

export type Stat = { value: number; suffix: string; label: string };
export type AdvantageItem = { icon: string; title: string; text: string };

const loadStats = unstable_cache(
  async (): Promise<Stat[]> => {
    const rows = await prisma.statItem.findMany({ orderBy: { order: "asc" } });
    return rows.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label }));
  },
  ["home-stats"],
  { tags: ["home"], revalidate: 3600 },
);

export const getStats = cache(loadStats);

const loadAdvantages = unstable_cache(
  async (): Promise<AdvantageItem[]> => {
    const rows = await prisma.advantage.findMany({ orderBy: { order: "asc" } });
    return rows.map((a) => ({ icon: a.icon, title: a.title, text: a.text }));
  },
  ["home-advantages"],
  { tags: ["home"], revalidate: 3600 },
);

export const getAdvantages = cache(loadAdvantages);
