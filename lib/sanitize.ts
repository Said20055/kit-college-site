import sanitizeHtml from "sanitize-html";

/**
 * Очищает HTML из WYSIWYG-редактора перед сохранением (защита от stored XSS).
 * Разрешён безопасный набор тегов форматирования; ссылки получают rel/target.
 */
export function sanitizeNewsHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "title"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: { ...attribs, rel: "noopener noreferrer", target: "_blank" },
      }),
    },
  }).trim();
}
