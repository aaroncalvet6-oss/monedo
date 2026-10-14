"use client";

import type { ReactNode } from "react";
import { ProgressProvider } from "@/features/progress/progress-provider";

/**
 * App-wide providers. Kept to the minimum because they load on every page: animation config
 * lives in the lesson reader (the only place that animates).
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
