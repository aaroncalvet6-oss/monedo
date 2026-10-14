import { STORAGE_KEYS } from "@/lib/storage-keys";

type KeyValueStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const MAX_NAME_LENGTH = 60;

function browserStorage(): KeyValueStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Collapses spaces and trims to {@link MAX_NAME_LENGTH} characters. */
export function cleanName(name: string): string {
  return name.replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LENGTH).trim();
}

/**
 * The learner's name for certificates. It is written by the learner and only ever stored in
 * this browser (never in progress, never sent anywhere). Storage errors are ignored: the
 * certificate still works, it just will not remember the name.
 */
export const certificateName = {
  load(storage: KeyValueStorage | null = browserStorage()): string {
    try {
      return cleanName(storage?.getItem(STORAGE_KEYS.certificateName) ?? "");
    } catch {
      return "";
    }
  },
  save(name: string, storage: KeyValueStorage | null = browserStorage()): void {
    const clean = cleanName(name);
    try {
      if (clean) storage?.setItem(STORAGE_KEYS.certificateName, clean);
      else storage?.removeItem(STORAGE_KEYS.certificateName);
    } catch {
      // Blocked or full storage: nothing to do.
    }
  },
  clear(storage: KeyValueStorage | null = browserStorage()): void {
    try {
      storage?.removeItem(STORAGE_KEYS.certificateName);
    } catch {
      // Ignore.
    }
  },
};
