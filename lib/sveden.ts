/**
 * Структурированные данные спецраздела «Сведения об образовательной организации».
 * Состав информации — по Приказу Рособрнадзора № 1493 (ред. № 1353 от 03.07.2025), пункты 7–20.
 *
 * ВНИМАНИЕ (перед публикацией):
 *  - Файлы документов (поле href) необходимо загрузить и заменить пути на реальные.
 *  - Имена атрибутов микроразметки (itemprop) приведены по распространённой схеме Рособрнадзора;
 *    перед запуском проверьте страницы официальным парсером и при необходимости уточните названия.
 *  - Числовые и персональные данные приведены как образец и подлежат актуализации
 *    в течение 10 рабочих дней (ПП РФ № 1802).
 */

export type DocItem = { title: string; note?: string; href: string };

export const documents: DocItem[] = [
  { title: "Устав образовательной организации", href: "/sveden/files/ustav.pdf" },
  { title: "Правила внутреннего распорядка обучающихся", href: "/sveden/files/pravila-obuchayushchihsya.pdf" },
  { title: "Правила внутреннего трудового распорядка", href: "/sveden/files/pravila-trudovye.pdf" },
  { title: "Коллективный договор", href: "/sveden/files/kollektivnyy-dogovor.pdf" },
  { title: "Положение о порядке и основаниях перевода, отчисления и восстановления обучающихся", href: "/sveden/files/lna-perevod.pdf" },
  { title: "Положение о текущем контроле и промежуточной аттестации", href: "/sveden/files/lna-attestaciya.pdf" },
  { title: "Положение о режиме занятий обучающихся", href: "/sveden/files/lna-rezhim.pdf" },
  { title: "Правила приёма на обучение по программам СПО на 2026/2027 уч. год", href: "/sveden/files/pravila-priema-2026.pdf" },
  { title: "Отчёт о результатах самообследования", href: "/sveden/files/samoobsledovanie.pdf" },
  { title: "Предписания органов государственного контроля (надзора) в сфере образования", note: "При наличии", href: "/sveden/files/predpisaniya.pdf" },
];

export const licenseDocs: DocItem[] = [
  { title: "Лицензия на осуществление образовательной деятельности (выписка из реестра лицензий)", href: "/sveden/files/licenziya.pdf" },
  { title: "Свидетельство о государственной аккредитации (выписка из реестра)", href: "/sveden/files/akkreditaciya.pdf" },
];

export type StructUnit = {
  name: string;
  head: string;
  post: string;
  address: string;
  site: string;
  email: string;
  position: string; // ссылка на положение
};

export const structUnits: StructUnit[] = [
  {
    name: "Администрация",
    head: "Даибов Магомед Алиевич",
    post: "Директор",
    address: "368001, Республика Дагестан, г. Хасавюрт, ул. Тотурбиева, д. 61",
    site: "",
    email: "gbpou_kol_innov@e-dag.ru",
    position: "/sveden/files/polozhenie-administraciya.pdf",
  },
  {
    name: "Учебная часть",
    head: "—",
    post: "Заместитель директора по учебной работе",
    address: "368001, Республика Дагестан, г. Хасавюрт, ул. Тотурбиева, д. 61",
    site: "",
    email: "gbpou_kol_innov@e-dag.ru",
    position: "/sveden/files/polozhenie-uchebnaya-chast.pdf",
  },
  {
    name: "Отделение информационных технологий",
    head: "—",
    post: "Заведующий отделением",
    address: "368001, Республика Дагестан, г. Хасавюрт, ул. Тотурбиева, д. 61",
    site: "",
    email: "gbpou_kol_innov@e-dag.ru",
    position: "/sveden/files/polozhenie-otdelenie-it.pdf",
  },
  {
    name: "Воспитательный отдел",
    head: "—",
    post: "Заместитель директора по воспитательной работе",
    address: "368001, Республика Дагестан, г. Хасавюрт, ул. Тотурбиева, д. 61",
    site: "",
    email: "gbpou_kol_innov@e-dag.ru",
    position: "/sveden/files/polozhenie-vospitatelnyy-otdel.pdf",
  },
  {
    name: "Бухгалтерия",
    head: "—",
    post: "Главный бухгалтер",
    address: "368001, Республика Дагестан, г. Хасавюрт, ул. Тотурбиева, д. 61",
    site: "",
    email: "gbpou_kol_innov@e-dag.ru",
    position: "/sveden/files/polozhenie-buhgalteriya.pdf",
  },
];

export const governanceBodies = [
  "Общее собрание работников и обучающихся",
  "Педагогический совет",
  "Совет колледжа",
  "Студенческий совет",
  "Родительский комитет",
];

export type TeacherRow = {
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

export const teachers: TeacherRow[] = [
  {
    fio: "—",
    post: "Преподаватель профессиональных дисциплин",
    disciplines: "Основы программирования, Веб-разработка",
    eduLevel: "Высшее образование — специалитет",
    qualification: "Инженер по специальности «Вычислительные машины, комплексы, системы и сети»",
    degree: "—",
    academicStatus: "—",
    retraining: "«Педагогика профессионального образования»",
    qualImprovement: "«Цифровые технологии в образовании», 2025 г.",
    generalExp: "12",
    specialExp: "9",
    programs: "09.02.07 Информационные системы и программирование",
  },
  {
    fio: "—",
    post: "Преподаватель профессиональных дисциплин",
    disciplines: "Сетевое администрирование, Информационная безопасность",
    eduLevel: "Высшее образование — магистратура",
    qualification: "Магистр по направлению «Информационная безопасность»",
    degree: "—",
    academicStatus: "—",
    retraining: "—",
    qualImprovement: "«Защита информации в АСУ», 2024 г.",
    generalExp: "8",
    specialExp: "6",
    programs: "10.02.05 Обеспечение информационной безопасности АС",
  },
  {
    fio: "—",
    post: "Преподаватель общеобразовательных дисциплин",
    disciplines: "Математика, Информатика",
    eduLevel: "Высшее образование — специалитет",
    qualification: "Учитель математики и информатики",
    degree: "—",
    academicStatus: "—",
    retraining: "—",
    qualImprovement: "«Методика преподавания математики», 2025 г.",
    generalExp: "18",
    specialExp: "18",
    programs: "Все реализуемые программы СПО",
  },
];

export type EduCount = {
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

export const eduPrograms: EduCount[] = [
  { code: "09.02.07", name: "Информационные системы и программирование", level: "Среднее профессиональное", form: "Очная", duration: "3 г. 10 мес.", budget: 75, paid: 25, foreign: 0, accredited: true },
  { code: "09.02.06", name: "Сетевое и системное администрирование", level: "Среднее профессиональное", form: "Очная", duration: "3 г. 10 мес.", budget: 50, paid: 10, foreign: 0, accredited: true },
  { code: "09.02.08", name: "Интеллектуальные интегрированные системы", level: "Среднее профессиональное", form: "Очная", duration: "3 г. 10 мес.", budget: 25, paid: 5, foreign: 0, accredited: true },
  { code: "09.02.11", name: "Разработка и управление программным обеспечением", level: "Среднее профессиональное", form: "Очная", duration: "3 г. 10 мес.", budget: 25, paid: 5, foreign: 0, accredited: true },
  { code: "10.02.05", name: "Обеспечение информационной безопасности автоматизированных систем", level: "Среднее профессиональное", form: "Очная", duration: "3 г. 10 мес.", budget: 50, paid: 15, foreign: 0, accredited: true },
  { code: "23.02.07", name: "Техническое обслуживание и ремонт автотранспортных средств", level: "Среднее профессиональное", form: "Очная", duration: "3 г. 10 мес.", budget: 50, paid: 25, foreign: 0, accredited: true },
  { code: "35.02.16", name: "Эксплуатация и ремонт сельскохозяйственной техники и оборудования", level: "Среднее профессиональное", form: "Очная", duration: "3 г. 10 мес.", budget: 25, paid: 0, foreign: 0, accredited: true },
  { code: "38.02.01", name: "Экономика и бухгалтерский учёт (по отраслям)", level: "Среднее профессиональное", form: "Очная / заочная", duration: "2 г. 10 мес.", budget: 25, paid: 25, foreign: 0, accredited: true },
  { code: "40.02.02", name: "Правоохранительная деятельность", level: "Среднее профессиональное", form: "Очная", duration: "2 г. 6 мес.", budget: 25, paid: 25, foreign: 0, accredited: true },
];

export const vacantPlaces = eduPrograms.map((p) => ({
  code: p.code,
  name: p.name,
  budgetVacant: 0,
  paidVacant: Math.max(0, Math.round(p.paid * 0.2)),
}));

export const mtbItems = [
  { title: "Учебные кабинеты", value: "24 оборудованных кабинета общеобразовательных и профессиональных дисциплин" },
  { title: "Лаборатории и мастерские", value: "Лаборатории программирования, сетей, информационной безопасности; слесарные и автомастерские" },
  { title: "Объекты для практических занятий", value: "Компьютерные классы, площадка «Профессионалитета», IT-КУБ" },
  { title: "Библиотека", value: "Читальный зал на 40 мест, доступ к электронно-библиотечной системе" },
  { title: "Объекты спорта", value: "Спортивный зал, открытая спортивная площадка, тренажёрный зал" },
  { title: "Средства обучения и воспитания", value: "Мультимедийные комплексы, серверное и сетевое оборудование, лицензионное ПО" },
  { title: "Доступ к информационным системам и сетям", value: "Проводной и беспроводной доступ в Интернет во всех учебных корпусах" },
  { title: "Электронные образовательные ресурсы", value: "ЭБС, образовательные платформы, доступ к федеральным цифровым ресурсам" },
];

export const ovzConditions = [
  "Обеспечен доступ в здание для инвалидов и лиц с ОВЗ (пандус, расширенные дверные проёмы, кнопка вызова).",
  "Версия официального сайта для слабовидящих (ГОСТ Р 52872-2019).",
  "Специальные технические средства обучения коллективного и индивидуального пользования — по индивидуальному запросу.",
  "Возможность обучения по адаптированным образовательным программам.",
  "Условия питания и охраны здоровья обучающихся с учётом потребностей инвалидов и лиц с ОВЗ.",
];

export const stipends = [
  "Государственная академическая стипендия — обучающимся очной формы за счёт бюджета по результатам промежуточной аттестации.",
  "Государственная социальная стипендия — отдельным категориям обучающихся в соответствии с законодательством.",
  "Меры социальной поддержки детям-сиротам и детям, оставшимся без попечения родителей.",
  "Материальная поддержка обучающихся, оказавшихся в трудной жизненной ситуации.",
];

export const finances = {
  year: "2025",
  budgetVolume: "Образовательная деятельность осуществляется преимущественно за счёт бюджета Республики Дагестан в рамках государственного задания.",
  income: "Поступление финансовых и материальных средств по итогам финансового года — в соответствии с планом финансово-хозяйственной деятельности.",
  spending: "Расходование средств — на оплату труда, содержание имущества, развитие материально-технической базы и обеспечение образовательного процесса.",
  planHref: "/sveden/files/plan-fhd-2026.pdf",
};

export const paidEduDocs: DocItem[] = [
  { title: "Положение о порядке оказания платных образовательных услуг", href: "/sveden/files/polozhenie-platnye.pdf" },
  { title: "Образец договора об оказании платных образовательных услуг", href: "/sveden/files/dogovor-platnye.pdf" },
  { title: "Приказ об утверждении стоимости обучения на 2026/2027 учебный год", href: "/sveden/files/stoimost-2026.pdf" },
];

export const fgosLinks = eduPrograms.map((p) => ({
  code: p.code,
  name: p.name,
  href: `https://fgos.ru/`,
}));
