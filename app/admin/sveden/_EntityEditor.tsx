import "server-only";
import { prisma } from "@/lib/db";
import { getMediaList } from "@/lib/data/media";
import { ENTITIES, type EntityKey } from "./_fields";
import { createEntity, updateEntity, deleteEntity } from "../_actions/sveden";
import { CollectionEditor } from "../_components/CollectionEditor";

type Row = { id: string } & Record<string, unknown>;
type Findable = { findMany: (args: { orderBy: { order: "asc" } }) => Promise<Row[]> };

const FINDERS = {
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
} as unknown as Record<EntityKey, Findable>;

/** Серверная обёртка: грузит записи, привязывает экшены и рендерит генерик-редактор. */
export async function EntityEditor({
  entityKey,
  redirectPath,
}: {
  entityKey: EntityKey;
  redirectPath: string;
}) {
  const cfg = ENTITIES[entityKey];
  const items = await FINDERS[entityKey].findMany({ orderBy: { order: "asc" } });

  const hasMedia = cfg.fields.some((f) => f.type === "media");
  const mediaDocs = hasMedia
    ? (await getMediaList("DOC")).map((m) => ({ id: m.id, label: m.title ?? m.originalName }))
    : [];

  return (
    <CollectionEditor
      config={cfg}
      items={items}
      createAction={createEntity.bind(null, entityKey, redirectPath)}
      updateAction={updateEntity.bind(null, entityKey, redirectPath)}
      deleteAction={deleteEntity.bind(null, entityKey, redirectPath)}
      mediaDocs={mediaDocs}
    />
  );
}
