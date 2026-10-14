/**
 * Every key Monedo writes to browser storage. All share the "monedo:" prefix because
 * the site is served from a <account>.github.io origin shared by every Pages project of
 * the account: localStorage is per origin, so unprefixed keys could collide.
 * Never call localStorage.clear(): remove Monedo's own keys only.
 */
export const STORAGE_PREFIX = "monedo:";

export const STORAGE_KEYS = {
  theme: `${STORAGE_PREFIX}theme`,
  progress: `${STORAGE_PREFIX}progress`,
  /** The name on certificates. Only ever stored in this browser. */
  certificateName: `${STORAGE_PREFIX}certificate-name`,
} as const;
