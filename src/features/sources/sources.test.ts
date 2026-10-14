import { describe, expect, it } from "vitest";
import { OFFICIAL_DOMAINS } from "@/content/schema";
import { organisationOf, publishedSources, SOURCE_NAMES } from "./sources";

describe("published sources", () => {
  it("names every approved official domain", () => {
    expect(Object.keys(SOURCE_NAMES).sort()).toEqual([...OFFICIAL_DOMAINS].sort());
  });

  it("lists the BOE and the Agencia Tributaria, each source with the lessons that use it", () => {
    const groups = publishedSources();
    const names = groups.map((g) => g.organisation);
    expect(names).toContain("Boletín Oficial del Estado (BOE)");
    expect(names).toContain("Agencia Tributaria");
    for (const group of groups) {
      for (const source of group.sources) {
        expect(organisationOf(source.url)).toBe(group.organisation);
        expect(source.lessons.length).toBeGreaterThan(0);
      }
    }
  });

  it("rejects anything that is not an official source", () => {
    expect(() => organisationOf("https://example.com/blog")).toThrow();
  });
});
