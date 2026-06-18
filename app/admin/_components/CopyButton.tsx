"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.origin + path);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* буфер недоступен */
        }
      }}
    >
      {done ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      {done ? "Скопировано" : "Ссылка"}
    </button>
  );
}
