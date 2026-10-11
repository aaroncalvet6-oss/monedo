"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath, mainNav } from "./nav-items";

/** Fixed tab bar for mobile. Hidden from md up, where the header nav takes over. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-3">
        {mainNav.map(({ href, label, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-(--duration-fast)",
                  "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-focus",
                  active ? "text-fg" : "text-fg-subtle hover:text-fg-muted",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-0 h-0.5 w-8 rounded-full bg-brand transition-opacity duration-(--duration-base)",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon aria-hidden className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
