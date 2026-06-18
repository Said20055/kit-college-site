import {
  Cpu,
  GraduationCap,
  Handshake,
  Award,
  Accessibility,
  BadgeRussianRuble,
  ShieldCheck,
  Network,
  Car,
  Tractor,
  Scale,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Cpu,
  GraduationCap,
  Handshake,
  Award,
  Accessibility,
  BadgeRussianRuble,
  ShieldCheck,
  Network,
  Car,
  Tractor,
  Scale,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = MAP[name] ?? Cpu;
  return <Cmp className={className} aria-hidden="true" />;
}
