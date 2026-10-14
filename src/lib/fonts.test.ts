import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Same ranges as scripts/subset-fonts.py: the self-hosted Geist only has these characters.
const RANGES: [number, number][] = [
  [0x0000, 0x00ff],
  [0x0152, 0x0153],
  [0x2000, 0x206f],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2190, 0x21ff],
  [0x2212, 0x2212],
  [0x2248, 0x2248],
  [0x2260, 0x2265],
];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("subset fonts", () => {
  it("cover every character used in the code and content", () => {
    const missing = new Set<string>();
    for (const file of files(join(process.cwd(), "src"))) {
      for (const char of readFileSync(file, "utf8")) {
        const code = char.codePointAt(0)!;
        if (!RANGES.some(([from, to]) => code >= from && code <= to)) missing.add(char);
      }
    }
    expect([...missing], "run scripts/subset-fonts.py with a wider range").toEqual([]);
  });

  it("the subsetting script uses the same ranges", () => {
    const script = readFileSync(join(process.cwd(), "scripts/subset-fonts.py"), "utf8");
    expect(script).toContain(
      'UNICODES = "U+0000-00FF,U+0152-0153,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2248,U+2260-2265"',
    );
  });
});
