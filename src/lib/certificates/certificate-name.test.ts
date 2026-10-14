import { describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { certificateName, cleanName, MAX_NAME_LENGTH } from "./certificate-name";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

describe("certificate name", () => {
  it("is stored under the monedo: key only", () => {
    const storage = memoryStorage();
    certificateName.save("  Lucía   García ", storage);
    expect([...storage.data.keys()]).toEqual([STORAGE_KEYS.certificateName]);
    expect(certificateName.load(storage)).toBe("Lucía García");
  });

  it("removes the key when the name is emptied or cleared", () => {
    const storage = memoryStorage();
    certificateName.save("Hugo", storage);
    certificateName.save("   ", storage);
    expect(storage.data.size).toBe(0);
    certificateName.save("Hugo", storage);
    certificateName.clear(storage);
    expect(storage.data.size).toBe(0);
  });

  it("caps the length", () => {
    expect(cleanName("a".repeat(100))).toHaveLength(MAX_NAME_LENGTH);
  });

  it("survives storage that throws or is missing", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    };
    expect(certificateName.load(broken)).toBe("");
    expect(() => certificateName.save("Ana", broken)).not.toThrow();
    expect(certificateName.load(null)).toBe("");
  });
});
