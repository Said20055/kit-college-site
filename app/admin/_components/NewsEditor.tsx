"use client";

import { useCallback, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
} from "lucide-react";

function ToolbarBtn({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`grid size-8 place-items-center rounded transition ${
        active ? "bg-accent text-on-primary" : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

const editorBodyCls =
  "[&_.ProseMirror]:min-h-[16rem] [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-3 [&_.ProseMirror]:outline-none [&_.ProseMirror]:leading-relaxed [&_p]:my-2 [&_h2]:mt-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-accent-700 [&_a]:underline";

export function NewsEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [html, setHtml] = useState(defaultValue ?? "");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } })],
    content: defaultValue ?? "",
    onUpdate: ({ editor }: { editor: Editor }) => setHtml(editor.getHTML()),
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Адрес ссылки (URL):", prev ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }, [editor]);

  return (
    <div className="rounded-lg border bg-background">
      {editor ? (
        <>
          <div className="flex flex-wrap gap-0.5 border-b bg-muted/40 p-1.5">
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Полужирный">
              <Bold className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Курсив">
              <Italic className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="Подчёркнутый">
              <UnderlineIcon className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} label="Зачёркнутый">
              <Strikethrough className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <span className="mx-1 w-px self-stretch bg-border" aria-hidden="true" />
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Заголовок 2">
              <Heading2 className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Заголовок 3">
              <Heading3 className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Маркированный список">
              <List className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Нумерованный список">
              <ListOrdered className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Цитата">
              <Quote className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <span className="mx-1 w-px self-stretch bg-border" aria-hidden="true" />
            <ToolbarBtn onClick={setLink} active={editor.isActive("link")} label="Вставить ссылку">
              <Link2 className="size-4" aria-hidden="true" />
            </ToolbarBtn>
            <ToolbarBtn onClick={() => editor.chain().focus().unsetLink().run()} label="Убрать ссылку">
              <Unlink className="size-4" aria-hidden="true" />
            </ToolbarBtn>
          </div>
          <div className={editorBodyCls}>
            <EditorContent editor={editor} />
          </div>
        </>
      ) : (
        <div className="min-h-[16rem] px-4 py-3 text-sm text-muted-fg">
          Загрузка редактора…
        </div>
      )}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
