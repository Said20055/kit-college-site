import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/db";

/** Профиль организации — форма повторяет прежний объект `college` из lib/college.ts. */
export type College = {
  shortName: string;
  abbr: string;
  fullName: string;
  tagline: string;
  description: string;
  founded: string;
  inn: string;
  kpp: string;
  ogrn: string;
  founder: string;
  founderUrl: string;
  director: {
    name: string;
    post: string;
    receptionTime: string;
    phone: string;
    email: string;
  };
  contacts: {
    address: string;
    addressShort: string;
    phone: string;
    phoneHref: string;
    email: string;
    workTime: string;
    mapCoords: string;
  };
};

const loadCollege = unstable_cache(
  async (): Promise<College> => {
    const p = await prisma.collegeProfile.findUniqueOrThrow({
      where: { id: "singleton" },
    });
    return {
      shortName: p.shortName,
      abbr: p.abbr,
      fullName: p.fullName,
      tagline: p.tagline,
      description: p.description,
      founded: p.founded,
      inn: p.inn,
      kpp: p.kpp,
      ogrn: p.ogrn,
      founder: p.founder,
      founderUrl: p.founderUrl,
      director: {
        name: p.directorName,
        post: p.directorPost,
        receptionTime: p.directorReceptionTime,
        phone: p.directorPhone,
        email: p.directorEmail,
      },
      contacts: {
        address: p.address,
        addressShort: p.addressShort,
        phone: p.phone,
        phoneHref: p.phoneHref,
        email: p.email,
        workTime: p.workTime,
        mapCoords: p.mapCoords,
      },
    };
  },
  ["college-profile"],
  { tags: ["college"], revalidate: 3600 },
);

export const getCollege = cache(loadCollege);

export type NavItem = { label: string; href: string };

const loadNav = unstable_cache(
  async (): Promise<NavItem[]> => {
    const items = await prisma.navItem.findMany({ orderBy: { order: "asc" } });
    return items.map((n) => ({ label: n.label, href: n.href }));
  },
  ["nav-items"],
  { tags: ["nav"], revalidate: 3600 },
);

export const getNav = cache(loadNav);
