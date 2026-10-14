"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  applyThemePreference,
  readThemePreference,
  subscribeThemePreference,
  type ThemePreference,
} from "@/lib/theme/theme";
import { cn } from "@/lib/utils";

const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "Sistema", icon: Monitor },
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
];

/**
 * Theme menu (system, light, dark). Written without a menu library because it is in the
 * header of every page: a menu button with three radio items, arrow keys, Escape and
 * click-outside to close, and focus back on the button.
 */
export function ThemeToggle() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const preference = useSyncExternalStore(
    subscribeThemePreference,
    readThemePreference,
    () => "system" as const,
  );

  const close = (focusButton: boolean) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const checked = options.findIndex((o) => o.value === preference);
    itemRefs.current[Math.max(0, checked)]?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // Focus the checked item only when the menu opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    const items = itemRefs.current.filter(Boolean) as HTMLButtonElement[];
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const move = (to: number) => items[(to + items.length) % items.length]?.focus();
    if (event.key === "ArrowDown") move(index + 1);
    else if (event.key === "ArrowUp") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
    else if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") event.preventDefault();
      close(event.key === "Escape");
      return;
    } else return;
    event.preventDefault();
  };

  return (
    <div ref={rootRef} className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon-sm"
        aria-label="Cambiar tema"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {/* Icon follows the resolved theme via CSS, so it is correct before hydration. */}
        <Sun className="dark:hidden" />
        <Moon className="hidden dark:block" />
      </Button>
      {open ? (
        <div
          id={`${id}-menu`}
          role="menu"
          aria-label="Tema"
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-0 z-50 mt-2 flex w-44 animate-fade-in flex-col rounded-md border border-border bg-surface-raised p-1 shadow-overlay"
        >
          {options.map(({ value, label, icon: Icon }, index) => (
            <button
              key={value}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={preference === value}
              tabIndex={-1}
              onClick={() => {
                applyThemePreference(value);
                close(true);
              }}
              className={cn(
                "flex h-11 cursor-pointer items-center gap-2 rounded-sm px-2 text-left text-base text-fg md:h-9 md:text-sm",
                "hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-2 focus-visible:outline-focus",
                "[&_svg]:size-4 [&_svg]:text-fg-muted",
              )}
            >
              <Icon aria-hidden />
              <span className="flex-1">{label}</span>
              {preference === value ? (
                <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
