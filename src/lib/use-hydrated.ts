import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during the static render and the first client render, true afterwards. Use it for
 * anything that depends on today's date, so the static HTML never disagrees with the browser.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
