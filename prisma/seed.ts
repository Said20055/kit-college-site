import "dotenv/config";
import { prisma } from "../lib/db";
import {
  college,
  specialties,
  stats,
  advantages,
  mainNav,
  svedenSections,
  news,
  leadership,
} from "../lib/college";
import {
  documents,
  licenseDocs,
  structUnits,
  governanceBodies,
  teachers,
  eduPrograms,
  vacantPlaces,
  mtbItems,
  ovzConditions,
  stipends,
  finances,
  paidEduDocs,
  fgosLinks,
} from "../lib/sveden";
import { hashPassword } from "../lib/auth/password";

/** Экранирование текста перед оборачиванием в HTML-абзацы. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Массив абзацев → HTML (исходный формат новостей перед переходом на WYSIWYG). */
function paragraphsToHtml(paras: string[]): string {
  return paras.map((p) => `<p>${esc(p)}</p>`).join("");
}

async function clean() {
  // Контентные таблицы независимы (без внешних ключей) — порядок удаления не важен.
  await Promise.all([
    prisma.newsItem.deleteMany(),
    prisma.statItem.deleteMany(),
    prisma.advantage.deleteMany(),
    prisma.navItem.deleteMany(),
    prisma.program.deleteMany(),
    prisma.svedenSection.deleteMany(),
    prisma.document.deleteMany(),
    prisma.structUnit.deleteMany(),
    prisma.governanceBody.deleteMany(),
    prisma.manager.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.mtbItem.deleteMany(),
    prisma.ovzCondition.deleteMany(),
    prisma.stipend.deleteMany(),
    prisma.collegeProfile.deleteMany(),
    prisma.finances.deleteMany(),
  ]);
}

/** Создаёт первого администратора из переменных окружения (идемпотентно). */
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("⚠ ADMIN_EMAIL/ADMIN_PASSWORD не заданы — администратор не создан.");
    return;
  }
  if (await prisma.user.findUnique({ where: { email } })) {
    console.log(`Администратор ${email} уже существует — пропуск.`);
    return;
  }
  await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      fullName: "Администратор",
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log(`Создан администратор: ${email}`);
}

async function main() {
  await clean();
  await seedAdmin();

  // — Профиль организации и реквизиты (singleton) —
  await prisma.collegeProfile.create({
    data: {
      id: "singleton",
      shortName: college.shortName,
      abbr: college.abbr,
      fullName: college.fullName,
      tagline: college.tagline,
      description: college.description,
      founded: college.founded,
      inn: college.inn,
      kpp: college.kpp,
      ogrn: college.ogrn,
      founder: college.founder,
      founderUrl: college.founderUrl,
      directorName: college.director.name,
      directorPost: college.director.post,
      directorReceptionTime: college.director.receptionTime,
      directorPhone: college.director.phone,
      directorEmail: college.director.email,
      address: college.contacts.address,
      addressShort: college.contacts.addressShort,
      phone: college.contacts.phone,
      phoneHref: college.contacts.phoneHref,
      email: college.contacts.email,
      workTime: college.contacts.workTime,
      mapCoords: college.contacts.mapCoords,
    },
  });

  // — Главное меню —
  await prisma.navItem.createMany({
    data: mainNav.map((n, i) => ({ label: n.label, href: n.href, order: i })),
  });

  // — Новости —
  await prisma.newsItem.createMany({
    data: news.map((n) => ({
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
      bodyHtml: paragraphsToHtml(n.body),
      tag: n.tag,
      status: "PUBLISHED" as const,
      publishedAt: new Date(n.iso),
    })),
  });

  // — Показатели и преимущества (главная) —
  await prisma.statItem.createMany({
    data: stats.map((s, i) => ({
      value: s.value,
      suffix: s.suffix,
      label: s.label,
      order: i,
    })),
  });
  await prisma.advantage.createMany({
    data: advantages.map((a, i) => ({
      icon: a.icon,
      title: a.title,
      text: a.text,
      order: i,
    })),
  });

  // — Программы/специальности (объединение specialties + eduPrograms + vacant + fgos) —
  await prisma.program.createMany({
    data: eduPrograms.map((p, i) => {
      const spec = specialties.find((s) => s.code === p.code);
      const vac = vacantPlaces.find((v) => v.code === p.code);
      const fgos = fgosLinks.find((f) => f.code === p.code);
      return {
        code: p.code,
        name: p.name,
        qualification: spec?.qualification ?? "",
        group: spec?.group ?? "ИТ",
        level: p.level,
        forms: p.form,
        duration: p.duration,
        budgetPlaces: p.budget,
        paidPlaces: p.paid,
        foreignPlaces: p.foreign,
        accredited: p.accredited,
        budgetVacant: vac?.budgetVacant ?? 0,
        paidVacant: vac?.paidVacant ?? 0,
        fgosHref: fgos?.href ?? "https://fgos.ru/",
        isMarketing: Boolean(spec),
        order: i,
      };
    }),
  });

  // — Подразделы «Сведения» —
  await prisma.svedenSection.createMany({
    data: svedenSections.map((s, i) => ({
      slug: s.slug,
      title: s.title,
      short: s.short,
      order: i,
      isEnabled: true,
    })),
  });

  // — Документы (общие / лицензия / платные услуги) —
  await prisma.document.createMany({
    data: [
      ...documents.map((d, i) => ({
        title: d.title,
        note: d.note ?? null,
        href: d.href,
        category: "GENERAL" as const,
        order: i,
      })),
      ...licenseDocs.map((d, i) => ({
        title: d.title,
        note: d.note ?? null,
        href: d.href,
        category: "LICENSE" as const,
        order: i,
      })),
      ...paidEduDocs.map((d, i) => ({
        title: d.title,
        note: d.note ?? null,
        href: d.href,
        category: "PAID_EDU" as const,
        order: i,
      })),
    ],
  });

  // — Структура, органы управления, руководство —
  await prisma.structUnit.createMany({
    data: structUnits.map((u, i) => ({
      name: u.name,
      head: u.head,
      post: u.post,
      address: u.address,
      site: u.site,
      email: u.email,
      positionHref: u.position,
      order: i,
    })),
  });
  await prisma.governanceBody.createMany({
    data: governanceBodies.map((g, i) => ({ name: g, order: i })),
  });
  await prisma.manager.createMany({
    data: leadership.map((m, i) => ({
      name: m.name,
      post: m.post,
      phone: m.phone,
      email: m.email,
      order: i,
    })),
  });

  // — Педагогический состав —
  await prisma.teacher.createMany({
    data: teachers.map((t, i) => ({
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
      order: i,
    })),
  });

  // — Материально-техническое обеспечение, ОВЗ, стипендии —
  await prisma.mtbItem.createMany({
    data: mtbItems.map((m, i) => ({ title: m.title, value: m.value, order: i })),
  });
  await prisma.ovzCondition.createMany({
    data: ovzConditions.map((c, i) => ({ text: c, order: i })),
  });
  await prisma.stipend.createMany({
    data: stipends.map((s, i) => ({ text: s, order: i })),
  });

  // — Финансово-хозяйственная деятельность (singleton) —
  await prisma.finances.create({
    data: {
      id: "singleton",
      year: finances.year,
      budgetVolume: finances.budgetVolume,
      income: finances.income,
      spending: finances.spending,
      planHref: finances.planHref,
    },
  });

  // Сводка
  const counts = {
    news: await prisma.newsItem.count(),
    programs: await prisma.program.count(),
    svedenSections: await prisma.svedenSection.count(),
    documents: await prisma.document.count(),
    teachers: await prisma.teacher.count(),
    structUnits: await prisma.structUnit.count(),
    managers: await prisma.manager.count(),
    navItems: await prisma.navItem.count(),
  };
  console.log("Сид завершён:", counts);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
