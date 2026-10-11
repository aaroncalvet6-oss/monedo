"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/graphics/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { isActivePath, mainNav } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <Container width="wide" className="flex h-14 items-center gap-6">
        <Link
          href="/"
          className="-mx-1 inline-flex min-h-11 items-center rounded-sm px-1 focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Monedo, ir al inicio"
        >
          <Logo />
        </Link>
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-8 items-center rounded-sm px-3 text-sm font-medium transition-colors duration-(--duration-fast)",
                      "focus-visible:outline-2 focus-visible:outline-focus",
                      active ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="icon-sm"
            className={cn(isActivePath(pathname, "/perfil") && "text-brand-text")}
          >
            <Link
              href="/perfil"
              aria-label="Perfil"
              aria-current={isActivePath(pathname, "/perfil") ? "page" : undefined}
            >
              <UserRound />
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
