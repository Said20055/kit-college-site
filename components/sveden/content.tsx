import type { ReactNode } from "react";
import type { SvedenData } from "@/lib/data/sveden";
import { Block, Field, FieldList, DocList, TableWrap, Note, Prose } from "./parts";

const th = "whitespace-nowrap bg-muted px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground";
const td = "border-t border-border px-4 py-3 align-top text-muted-fg";

/** Содержимое подразделов спецраздела «Сведения об образовательной организации».
 *  Микроразметка (itemprop) — по схеме Рособрнадзора; проверьте официальным парсером перед публикацией.
 *  Данные берутся из БД (lib/data/sveden); проза пока в коде (станет редактируемой в Фазе 4). */
export function buildSectionContent(data: SvedenData): Record<string, ReactNode> {
  const {
    college,
    leadership,
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
  } = data;

  return {
  common: (
    <div itemScope>
      <Block title="Полное и сокращённое наименование">
        <FieldList>
          <Field label="Полное наименование" prop="fullName" value={college.fullName} />
          <Field label="Сокращённое наименование" prop="shortName" value={college.abbr} />
          <Field label="Дата создания" prop="regDate" value={`${college.founded} год`} />
          <Field
            label="Учредитель"
            prop="uchreditel"
            value={
              <a className="text-accent-700 underline" href={college.founderUrl} target="_blank" rel="noopener noreferrer">
                {college.founder}
              </a>
            }
          />
          <Field label="Место нахождения" prop="address" value={college.contacts.address} />
          <Field label="Места осуществления образовательной деятельности" prop="addressUL" value={college.contacts.address} />
          <Field label="Режим и график работы" prop="workTime" value={college.contacts.workTime} />
          <Field
            label="Контактные телефоны"
            prop="telephone"
            value={<a className="text-accent-700 underline" href={`tel:${college.contacts.phoneHref}`}>{college.contacts.phone}</a>}
          />
          <Field
            label="Адрес электронной почты"
            prop="email"
            value={<a className="text-accent-700 underline" href={`mailto:${college.contacts.email}`}>{college.contacts.email}</a>}
          />
        </FieldList>
      </Block>

      <Block title="Лицензия и государственная аккредитация">
        <DocList items={licenseDocs} />
        <Note>
          Сведения о наличии государственной аккредитации по реализуемым программам приведены в
          подразделе «Образование».
        </Note>
      </Block>
    </div>
  ),

  struct: (
    <Block title="Структура и органы управления">
      <Prose>
        <p>
          Управление колледжем осуществляется в соответствии с законодательством Российской Федерации
          и уставом на основе сочетания принципов единоначалия и коллегиальности.
        </p>
      </Prose>

      <h3 className="mt-6 mb-3 text-sm font-semibold text-foreground">Коллегиальные органы управления</h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {governanceBodies.map((g) => (
          <li key={g} className="rounded-xl border bg-surface px-4 py-3 text-sm text-foreground">
            {g}
          </li>
        ))}
      </ul>

      <h3 className="mt-8 mb-3 text-sm font-semibold text-foreground">Структурные подразделения</h3>
      <TableWrap>
        <thead>
          <tr>
            <th className={th}>Наименование</th>
            <th className={th}>Руководитель</th>
            <th className={th}>Должность</th>
            <th className={th}>Адрес</th>
            <th className={th}>E-mail</th>
            <th className={th}>Положение</th>
          </tr>
        </thead>
        <tbody>
          {structUnits.map((u) => (
            <tr key={u.name} itemScope>
              <td className={td}><span itemProp="name" className="font-medium text-foreground">{u.name}</span></td>
              <td className={td} itemProp="fio">{u.head}</td>
              <td className={td} itemProp="post">{u.post}</td>
              <td className={td} itemProp="addressStr">{u.address}</td>
              <td className={td}><a className="text-accent-700 underline" href={`mailto:${u.email}`} itemProp="email">{u.email}</a></td>
              <td className={td}><a className="text-accent-700 underline" href={u.position} itemProp="document">Скачать</a></td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <Note>ФИО руководителей подразделений актуализируются. Файлы положений загружаются администратором сайта.</Note>
    </Block>
  ),

  document: (
    <Block title="Документы">
      <Prose>
        <p>Копии документов размещены в виде электронных документов, доступных для просмотра и скачивания.</p>
      </Prose>
      <div className="mt-5">
        <DocList items={documents} />
      </div>
      <Note>Файлы документов загружаются администратором; до загрузки ссылки ведут на заглушки.</Note>
    </Block>
  ),

  education: (
    <Block title="Образование">
      <Prose>
        <p>
          Колледж реализует основные профессиональные образовательные программы среднего профессионального
          образования по очной и заочной формам обучения в соответствии с ФГОС СПО.
        </p>
      </Prose>

      <h3 className="mt-8 mb-3 text-sm font-semibold text-foreground">
        Реализуемые образовательные программы и численность обучающихся
      </h3>
      <TableWrap>
        <thead>
          <tr>
            <th className={th}>Код</th>
            <th className={th}>Специальность</th>
            <th className={th}>Форма</th>
            <th className={th}>Срок</th>
            <th className={th}>Бюджет</th>
            <th className={th}>По договорам</th>
            <th className={th}>Иностр. граждане</th>
            <th className={th}>Аккредитация</th>
          </tr>
        </thead>
        <tbody>
          {eduPrograms.map((p) => (
            <tr key={p.code} itemScope>
              <td className={td}><span itemProp="eduCode" className="font-mono font-semibold text-accent-700">{p.code}</span></td>
              <td className={td}><span itemProp="eduName" className="font-medium text-foreground">{p.name}</span><meta itemProp="eduLevel" content={p.level} /></td>
              <td className={td} itemProp="eduForm">{p.form}</td>
              <td className={td} itemProp="learningTerm">{p.duration}</td>
              <td className={td} itemProp="numberBR">{p.budget}</td>
              <td className={td} itemProp="numberP">{p.paid}</td>
              <td className={td} itemProp="numberOfStudentForeign">{p.foreign}</td>
              <td className={td}>{p.accredited ? "Имеется" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <h3 className="mt-8 mb-3 text-sm font-semibold text-foreground">Дополнительная информация</h3>
      <FieldList>
        <Field label="Язык, на котором ведётся обучение" value="Русский язык" />
        <Field label="Численность обучающихся — всего" value={`${eduPrograms.reduce((a, p) => a + p.budget + p.paid, 0)} человек`} />
        <Field label="Результаты приёма и перевода" value="Приведены в виде электронного документа (загружается администратором)." />
        <Field label="Трудоустройство выпускников" value="94% выпускников прошлого учебного года трудоустроены по специальности." />
      </FieldList>
      <Note>
        Описания образовательных программ (учебные планы, рабочие программы, практики, календарный
        учебный график) размещаются в виде активных ссылок и электронных документов.
      </Note>
    </Block>
  ),

  eduStandarts: (
    <Block title="Образовательные стандарты и требования">
      <Prose>
        <p>
          Образовательная деятельность ведётся в соответствии с федеральными государственными
          образовательными стандартами среднего профессионального образования (ФГОС СПО).
        </p>
      </Prose>
      <ul className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border bg-surface">
        {fgosLinks.map((f) => (
          <li key={f.code}>
            <a className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-accent-soft/40" href={f.href} target="_blank" rel="noopener noreferrer">
              <span className="font-mono text-sm font-semibold text-accent-700">{f.code}</span>
              <span className="text-sm text-foreground">ФГОС СПО — {f.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </Block>
  ),

  managers: (
    <Block title="Руководство">
      <TableWrap>
        <thead>
          <tr>
            <th className={th}>ФИО</th>
            <th className={th}>Должность</th>
            <th className={th}>Телефон</th>
            <th className={th}>E-mail</th>
          </tr>
        </thead>
        <tbody>
          {leadership.map((p, i) => (
            <tr key={i} itemScope>
              <td className={td}><span itemProp="fio" className="font-medium text-foreground">{p.name}</span></td>
              <td className={td} itemProp="post">{p.post}</td>
              <td className={td}><a className="text-accent-700 underline" href={`tel:${college.contacts.phoneHref}`} itemProp="telephone">{p.phone}</a></td>
              <td className={td}><a className="text-accent-700 underline" href={`mailto:${p.email}`} itemProp="email">{p.email}</a></td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <Note>
        Приём граждан руководителем: {college.director.receptionTime}. ФИО заместителей актуализируются.
      </Note>
    </Block>
  ),

  employees: (
    <Block title="Педагогический состав">
      <Prose>
        <p>Персональный состав педагогических работников по реализуемым образовательным программам.</p>
      </Prose>
      <div className="mt-5">
        <TableWrap>
          <thead>
            <tr>
              <th className={th}>ФИО</th>
              <th className={th}>Должность</th>
              <th className={th}>Преподаваемые дисциплины</th>
              <th className={th}>Уровень образования, квалификация</th>
              <th className={th}>Уч. степень / звание</th>
              <th className={th}>Повышение квалификации</th>
              <th className={th}>Стаж общий / по специальности</th>
              <th className={th}>Программы</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t, i) => (
              <tr key={i} itemScope>
                <td className={td}><span itemProp="fio" className="font-medium text-foreground">{t.fio}</span></td>
                <td className={td} itemProp="post">{t.post}</td>
                <td className={td} itemProp="teachingDiscipline">{t.disciplines}</td>
                <td className={td}><span itemProp="qualification">{t.eduLevel}. {t.qualification}</span></td>
                <td className={td}>{t.degree} / {t.academicStatus}</td>
                <td className={td} itemProp="qualificationRaising">{t.qualImprovement}</td>
                <td className={td}><span itemProp="generalExperience">{t.generalExp}</span> / <span itemProp="specialityExperience">{t.specialExp}</span> лет</td>
                <td className={td}>{t.programs}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
      <Note>Полный персональный состав педагогических работников актуализируется администратором сайта.</Note>
    </Block>
  ),

  objects: (
    <Block title="Материально-техническое обеспечение и оснащённость образовательного процесса">
      <dl className="grid gap-4 sm:grid-cols-2">
        {mtbItems.map((m) => (
          <div key={m.title} className="rounded-2xl border bg-surface p-5">
            <dt className="text-sm font-semibold text-foreground">{m.title}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted-fg">{m.value}</dd>
          </div>
        ))}
      </dl>
      <Note>
        Сведения о наличии общежития и формировании платы за проживание приведены в подразделе
        «Стипендии и меры поддержки обучающихся».
      </Note>
    </Block>
  ),

  grants: (
    <Block title="Стипендии и меры поддержки обучающихся">
      <ul className="space-y-3">
        {stipends.map((s) => (
          <li key={s} className="flex gap-3 rounded-2xl border bg-surface p-5 text-sm leading-relaxed text-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <FieldList>
          <Field label="Наличие общежития, интерната" value="Общежитие не предоставляется." />
          <Field label="Количество жилых помещений для иногородних" value="—" />
          <Field label="Формирование платы за проживание" value="Не взимается." />
        </FieldList>
      </div>
    </Block>
  ),

  paid_edu: (
    <Block title="Платные образовательные услуги">
      <Prose>
        <p>
          Платные образовательные услуги оказываются в соответствии с законодательством Российской
          Федерации и локальными нормативными актами колледжа.
        </p>
      </Prose>
      <div className="mt-5">
        <DocList items={paidEduDocs} />
      </div>
    </Block>
  ),

  budget: (
    <Block title="Финансово-хозяйственная деятельность">
      <FieldList>
        <Field label={`Объём образовательной деятельности (${finances.year})`} value={finances.budgetVolume} />
        <Field label="Поступление финансовых и материальных средств" value={finances.income} />
        <Field label="Расходование финансовых и материальных средств" value={finances.spending} />
      </FieldList>
      <div className="mt-5">
        <DocList items={[{ title: "План финансово-хозяйственной деятельности", href: finances.planHref }]} />
      </div>
    </Block>
  ),

  vacant: (
    <Block title="Вакантные места для приёма (перевода) обучающихся">
      <TableWrap>
        <thead>
          <tr>
            <th className={th}>Код</th>
            <th className={th}>Специальность</th>
            <th className={th}>За счёт бюджета</th>
            <th className={th}>По договорам</th>
          </tr>
        </thead>
        <tbody>
          {vacantPlaces.map((v) => (
            <tr key={v.code} itemScope>
              <td className={td}><span itemProp="eduCode" className="font-mono font-semibold text-accent-700">{v.code}</span></td>
              <td className={td}><span itemProp="eduName" className="text-foreground">{v.name}</span></td>
              <td className={td} itemProp="numberBR">{v.budgetVacant}</td>
              <td className={td} itemProp="numberP">{v.paidVacant}</td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <Note>Данные о вакантных местах обновляются по мере изменения контингента.</Note>
    </Block>
  ),

  ovz: (
    <Block title="Доступная среда">
      <Prose>
        <p>Специальные условия для получения образования инвалидами и лицами с ограниченными возможностями здоровья.</p>
      </Prose>
      <ul className="mt-5 space-y-3">
        {ovzConditions.map((c) => (
          <li key={c} className="flex gap-3 rounded-2xl border bg-surface p-5 text-sm leading-relaxed text-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
    </Block>
  ),

  inter: (
    <Block title="Международное сотрудничество">
      <Prose>
        <p>
          Договоры с иностранными и (или) международными организациями по вопросам образования и науки
          на текущий момент не заключались. Информация будет обновлена при их заключении.
        </p>
      </Prose>
    </Block>
  ),

  catering: (
    <Block title="Организация питания в образовательной организации">
      <Prose>
        <p>
          В колледже созданы условия для питания и охраны здоровья обучающихся. Горячее питание
          организовано в столовой; обеспечен питьевой режим.
        </p>
      </Prose>
      <div className="mt-5">
        <FieldList>
          <Field label="Условия питания" value="Столовая на территории колледжа, буфет, питьевой режим." />
          <Field label="Условия охраны здоровья" value="Медицинский кабинет, мероприятия по охране здоровья обучающихся." />
          <Field label="Диетическое меню" value="Предоставляется по медицинским показаниям при наличии заявления." />
          <Field
            label="Обратная связь по питанию"
            value={<a className="text-accent-700 underline" href={`mailto:${college.contacts.email}`}>{college.contacts.email}</a>}
          />
        </FieldList>
      </div>
    </Block>
  ),
  };
}
