"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Images,
  FileText,
  Globe,
  Users,
  ScrollText,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

type Item = { href: string; label: string; icon: LucideIcon; adminOnly?: boolean };

const ITEMS: Item[] = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/news", label: "Новости", icon: Newspaper },
  { href: "/admin/sveden", label: "Сведения", icon: FileText },
  { href: "/admin/site", label: "Сайт и контакты", icon: Globe },
  { href: "/admin/media", label: "Медиатека", icon: Images },
  { href: "/admin/users", label: "Пользователи", icon: Users, adminOnly: true },
  { href: "/admin/audit", label: "Журнал аудита", icon: ScrollText, adminOnly: true },
  { href: "/admin/account", label: "Мой профиль", icon: UserCircle },
];

export function AdminNav({ role }: { role: "ADMIN" | "EDITOR" }) {
  const pathname = usePathname();
  const items = ITEMS.filter((i) => !i.adminOnly || role === "ADMIN");

  return (
    <nav aria-label="Навигация админпанели" className="space-y-1">
      {items.map((i) => {
        const active =
          i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
        const Icon = i.icon;
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-on-primary/15 text-on-primary"
                : "text-on-primary/75 hover:bg-on-primary/10 hover:text-on-primary"
            }`}
          >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
