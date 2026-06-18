import Link from "next/link";
import Image from "next/image";

export function Logo({
  inverse = false,
  abbr,
}: {
  inverse?: boolean;
  abbr: string;
}) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label={`${abbr} — на главную`}
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl p-1 shadow-sm transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundColor: "var(--color-primary)",
          backgroundImage:
            "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
        }}
      >
        <Image
          src="/images/logo.png"
          alt=""
          width={44}
          height={44}
          className="size-full object-contain"
          priority
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={`font-serif text-base font-bold ${inverse ? "text-on-primary" : "text-foreground"}`}
        >
          Колледж
        </span>
        <span
          className={`text-[11px] font-medium uppercase tracking-wide ${
            inverse ? "text-on-primary/80" : "text-muted-fg"
          }`}
        >
          инновационных технологий
        </span>
      </span>
    </Link>
  );
}
