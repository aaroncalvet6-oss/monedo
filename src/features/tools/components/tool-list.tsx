import { Calculator } from "lucide-react";
import Link from "next/link";
import { toolHref, tools } from "../tools";

export function ToolList() {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {tools.map((tool) => (
        <li key={tool.id}>
          <Link
            href={toolHref(tool)}
            className="flex h-full items-start gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-focus"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-subtle text-brand-subtle-fg">
              <Calculator aria-hidden className="size-5" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-lg font-semibold tracking-tight">{tool.title}</span>
              <span className="text-base leading-7 text-fg-muted">{tool.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
