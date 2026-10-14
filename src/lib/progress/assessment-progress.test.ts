import { describe, expect, it } from "vitest";
import { recordAttempt } from "./assessment-progress";

const day1 = new Date("2026-10-14T10:00:00.000Z");
const day2 = new Date("2026-10-15T10:00:00.000Z");

describe("recordAttempt", () => {
  it("starts with the first attempt", () => {
    expect(recordAttempt(undefined, "c", 5, 10, false, day1)).toEqual({
      courseSlug: "c",
      bestScore: 5,
      total: 10,
      attempts: 1,
      passedAt: null,
      updatedAt: day1.toISOString(),
    });
  });

  it("keeps the best score and the first pass date", () => {
    const passed = recordAttempt(
      recordAttempt(undefined, "c", 5, 10, false, day1),
      "c",
      8,
      10,
      true,
      day1,
    );
    const later = recordAttempt(passed, "c", 4, 10, false, day2);
    expect(later).toMatchObject({ bestScore: 8, attempts: 3, passedAt: day1.toISOString() });
    expect(later.updatedAt).toBe(day2.toISOString());
  });
});
