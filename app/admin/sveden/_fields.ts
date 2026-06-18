// Описания полей сущностей спецраздела «Сведения».
// Один источник истины для генерик-редактора (клиент) и серверных экшенов (парсинг).
// Plain-data модуль: без "use server"/"server-only" — импортируется и там, и там.

export type FieldType = "text" | "textarea" | "int" | "bool" | "select" | "media";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  /** Варианты для select. */
  options?: { value: string; label: string }[];
  required?: boolean;
  /** Пустое значение сохраняется как NULL (для необязательных связей/заметок). */
  nullable?: boolean;
  placeholder?: string;
  help?: string;
  /** Растянуть на всю ширину сетки формы. */
  full?: boolean;
};

/** Ключ сущности = имя делегата Prisma (prisma[key]). */
export type EntityKey =
  | "document"
  | "program"
  | "structUnit"
  | "governanceBody"
  | "manager"
  | "teacher"
  | "mtbItem"
  | "ovzCondition"
  | "stipend"
  // Контент сайта (Фаза 5)
  | "navItem"
  | "statItem"
  | "advantage";

/** Иконки преимуществ — фиксированный набор из components/ui/Icon.tsx. */
const ADVANTAGE_ICONS: { value: string; label: string }[] = [
  { value: "Cpu", label: "Процессор / ИТ" },
  { value: "GraduationCap", label: "Выпускник / обучение" },
  { value: "Handshake", label: "Партнёрство" },
  { value: "Award", label: "Награда / качество" },
  { value: "Accessibility", label: "Доступная среда" },
  { value: "BadgeRussianRuble", label: "Финансы / стипендия" },
  { value: "ShieldCheck", label: "Гарантия / защита" },
  { value: "Network", label: "Сеть / связи" },
  { value: "Car", label: "Автомобиль" },
  { value: "Tractor", label: "Трактор / техника" },
  { value: "Scale", label: "Право / юриспруденция" },
];

export type EntityConfig = {
  /** Единственное число для подписей кнопок/диалогов. */
  label: string;
  /** Множественное — для заголовков. */
  labelPlural: string;
  /** Поле, значение которого попадает в журнал аудита и заголовок строки. */
  titleField: string;
  /** Теги кэша, которые нужно сбросить после изменений. */
  tags: string[];
  fields: Field[];
};

const orderField: Field = {
  name: "order",
  label: "Порядок",
  type: "int",
  help: "Сортировка по возрастанию. 0 — добавить в конец.",
};

export const ENTITIES: Record<EntityKey, EntityConfig> = {
  document: {
    label: "документ",
    labelPlural: "Документы",
    titleField: "title",
    tags: ["sveden"],
    fields: [
      { name: "title", label: "Название", type: "text", required: true, full: true },
      {
        name: "category",
        label: "Категория",
        type: "select",
        required: true,
        options: [
          { value: "GENERAL", label: "Документы (общий раздел)" },
          { value: "LICENSE", label: "Лицензия и аккредитация" },
          { value: "PAID_EDU", label: "Платные образовательные услуги" },
        ],
      },
      orderField,
      { name: "note", label: "Примечание", type: "text", nullable: true, full: true },
      {
        name: "fileId",
        label: "Файл из медиатеки",
        type: "media",
        nullable: true,
        full: true,
        help: "Привязанный файл отдаётся по /media/… и имеет приоритет над ссылкой ниже.",
      },
      {
        name: "href",
        label: "Внешняя ссылка (если без файла)",
        type: "text",
        full: true,
        placeholder: "https://… или /docs/…",
      },
    ],
  },

  program: {
    label: "программу",
    labelPlural: "Образовательные программы",
    titleField: "name",
    tags: ["programs", "sveden", "home"],
    fields: [
      { name: "code", label: "Код", type: "text", required: true, placeholder: "09.02.07" },
      { name: "name", label: "Наименование", type: "text", required: true, full: true },
      { name: "qualification", label: "Квалификация", type: "text", full: true },
      { name: "group", label: "Укрупнённая группа", type: "text", full: true },
      { name: "level", label: "Уровень образования", type: "text" },
      { name: "forms", label: "Формы обучения", type: "text", placeholder: "очная, заочная" },
      { name: "duration", label: "Срок обучения", type: "text" },
      { name: "budgetPlaces", label: "Бюджетных мест", type: "int" },
      { name: "paidPlaces", label: "Мест по договорам", type: "int" },
      { name: "foreignPlaces", label: "Мест для иностранцев", type: "int" },
      { name: "budgetVacant", label: "Вакантных (бюджет)", type: "int" },
      { name: "paidVacant", label: "Вакантных (договор)", type: "int" },
      { name: "fgosHref", label: "Ссылка на ФГОС", type: "text", full: true },
      { name: "accredited", label: "Есть госаккредитация", type: "bool" },
      {
        name: "isMarketing",
        label: "Показывать в маркетинговых блоках",
        type: "bool",
        help: "Главная страница и раздел «Абитуриенту».",
      },
      orderField,
    ],
  },

  structUnit: {
    label: "подразделение",
    labelPlural: "Структурные подразделения",
    titleField: "name",
    tags: ["sveden"],
    fields: [
      { name: "name", label: "Наименование", type: "text", required: true, full: true },
      { name: "head", label: "Руководитель (ФИО)", type: "text" },
      { name: "post", label: "Должность", type: "text" },
      { name: "address", label: "Адрес", type: "text", full: true },
      { name: "site", label: "Сайт", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      {
        name: "positionHref",
        label: "Ссылка на положение",
        type: "text",
        full: true,
        placeholder: "/docs/… или https://…",
      },
      orderField,
    ],
  },

  governanceBody: {
    label: "орган управления",
    labelPlural: "Коллегиальные органы управления",
    titleField: "name",
    tags: ["sveden"],
    fields: [
      { name: "name", label: "Наименование органа", type: "text", required: true, full: true },
      orderField,
    ],
  },

  manager: {
    label: "руководителя",
    labelPlural: "Руководство",
    titleField: "name",
    tags: ["sveden"],
    fields: [
      { name: "name", label: "ФИО", type: "text", required: true, full: true },
      { name: "post", label: "Должность", type: "text", full: true },
      { name: "phone", label: "Телефон", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      orderField,
    ],
  },

  teacher: {
    label: "преподавателя",
    labelPlural: "Педагогический состав",
    titleField: "fio",
    tags: ["sveden"],
    fields: [
      { name: "fio", label: "ФИО", type: "text", required: true, full: true },
      { name: "post", label: "Должность", type: "text", full: true },
      { name: "disciplines", label: "Преподаваемые дисциплины", type: "textarea", full: true },
      { name: "eduLevel", label: "Уровень образования", type: "text" },
      { name: "qualification", label: "Квалификация по диплому", type: "text" },
      { name: "degree", label: "Учёная степень", type: "text" },
      { name: "academicStatus", label: "Учёное звание", type: "text" },
      { name: "retraining", label: "Профессиональная переподготовка", type: "text", full: true },
      { name: "qualImprovement", label: "Повышение квалификации", type: "text", full: true },
      { name: "generalExp", label: "Общий стаж", type: "text" },
      { name: "specialExp", label: "Стаж по специальности", type: "text" },
      { name: "programs", label: "Преподаваемые программы", type: "textarea", full: true },
      orderField,
    ],
  },

  mtbItem: {
    label: "пункт",
    labelPlural: "Материально-техническое обеспечение",
    titleField: "title",
    tags: ["sveden"],
    fields: [
      { name: "title", label: "Заголовок", type: "text", required: true, full: true },
      { name: "value", label: "Описание", type: "textarea", required: true, full: true },
      orderField,
    ],
  },

  ovzCondition: {
    label: "условие",
    labelPlural: "Доступная среда (ОВЗ)",
    titleField: "text",
    tags: ["sveden"],
    fields: [
      { name: "text", label: "Условие", type: "textarea", required: true, full: true },
      orderField,
    ],
  },

  stipend: {
    label: "меру поддержки",
    labelPlural: "Стипендии и меры поддержки",
    titleField: "text",
    tags: ["sveden"],
    fields: [
      { name: "text", label: "Описание", type: "textarea", required: true, full: true },
      orderField,
    ],
  },

  // ─── Контент сайта (Фаза 5) ──────────────────────────────────────────────

  navItem: {
    label: "пункт меню",
    labelPlural: "Главное меню",
    titleField: "label",
    tags: ["nav"],
    fields: [
      { name: "label", label: "Подпись", type: "text", required: true },
      { name: "href", label: "Ссылка", type: "text", required: true, placeholder: "/sveden" },
      orderField,
    ],
  },

  statItem: {
    label: "показатель",
    labelPlural: "Числовые показатели (главная)",
    titleField: "label",
    tags: ["home"],
    fields: [
      { name: "value", label: "Значение", type: "int", required: true },
      { name: "suffix", label: "Суффикс", type: "text", placeholder: "+, %, лет" },
      { name: "label", label: "Подпись", type: "text", required: true, full: true },
      orderField,
    ],
  },

  advantage: {
    label: "преимущество",
    labelPlural: "Преимущества (главная)",
    titleField: "title",
    tags: ["home"],
    fields: [
      { name: "icon", label: "Иконка", type: "select", required: true, options: ADVANTAGE_ICONS },
      { name: "title", label: "Заголовок", type: "text", required: true, full: true },
      { name: "text", label: "Описание", type: "textarea", required: true, full: true },
      orderField,
    ],
  },
};
