import { BookOpen, Calculator, Home, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

/** Main navigation. Profile lives as an icon in the header. */
export const mainNav: readonly NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/cursos", label: "Cursos", icon: BookOpen },
  { href: "/herramientas", label: "Herramientas", icon: Calculator },
];

export function isActivePath(pathname: string, href: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}
