import { describe, expect, it } from "vitest";
import { getLesson, getPublishedCourses } from "@/content";
import { TOOL_IDS } from "@/content/schema";
import { compoundSentence } from "./components/compound-interest-tool";
import { budgetSentence } from "./components/budget-tool";
import { howMuchSentence, whenSentence } from "./components/savings-goal-tool";
import { teenBudget } from "@/lib/finance/teen-budget";
import { tools } from "./tools";

describe("tools registry", () => {
  it("publishes every tool lessons can link to, and nothing else", () => {
    expect(tools.map((t) => t.id).sort()).toEqual([...TOOL_IDS].sort());
  });

  it("links each tool to a published lesson that links back to it", () => {
    const published = new Set(getPublishedCourses().map((c) => c.slug));
    for (const tool of tools) {
      expect(published.has(tool.lesson.course), tool.id).toBe(true);
      const lesson = getLesson(tool.lesson.course, tool.lesson.lesson);
      expect(lesson, tool.id).toBeDefined();
      const links = lesson!.blocks.filter((b) => b.type === "text" && b.tool === tool.id);
      expect(links, `${tool.id} is linked from its lesson`).toHaveLength(1);
    }
  });

  it("every tool link in a lesson goes to the tool that points back to that lesson", () => {
    for (const course of getPublishedCourses()) {
      for (const { slug } of course.lessons) {
        for (const block of getLesson(course.slug, slug)!.blocks) {
          if (block.type !== "text" || !block.tool) continue;
          const tool = tools.find((t) => t.id === block.tool)!;
          expect(tool.lesson, `${course.slug}/${slug}`).toEqual({
            course: course.slug,
            lesson: slug,
          });
        }
      }
    }
  });
});

/** Intl puts non-breaking spaces before «€»; compare the words, not the spaces. */
const plain = (text: string) => text.replace(/\s/g, " ");

describe("result sentences", () => {
  it("explain compound growth, including losses and zero", () => {
    expect(plain(compoundSentence(1540, 1874, 10, 4))).toBe(
      "Si pones 1.540 € en 10 años y crece un 4 % al año, tendrías unos 1.874 €. De ellos, 334 € los habría ganado tu dinero, no tú.",
    );
    expect(plain(compoundSentence(1000, 800, 1, -20))).toContain("pierde un 20 % al año");
    expect(plain(compoundSentence(410, 410, 3, 0))).toContain("tendrías lo mismo que pusiste");
  });

  it("explain the budget in one sentence, and warn when it does not fit", () => {
    const hugo = { allowance: 60, gifts: 0, jobs: 0, ownExpenses: 20 };
    expect(plain(budgetSentence(teenBudget(hugo)!))).toBe(
      "De tus 60 € al mes, 20 € van a lo que pagas tú. Apartas 12 € (el 20 %) el día que cobras y te quedan 28 € de gasto libre.",
    );
    expect(plain(budgetSentence(teenBudget({ ...hugo, ownExpenses: 75 })!))).toContain(
      "te faltan 15 € al mes",
    );
    expect(plain(budgetSentence(teenBudget({ ...hugo, ownExpenses: 55 })!))).toContain(
      "te faltan 7 € para llegar al 20 %",
    );
  });

  it("explain the savings goal in both modes", () => {
    expect(plain(whenSentence("Unos cascos", 80, 16, 8, new Date(2026, 9, 12)))).toBe(
      "Te faltan 64 €. Apartando 8 € al mes, conseguirás unos cascos en 8 meses, en junio de 2027.",
    );
    expect(plain(whenSentence("", 80, 16, 0))).toContain(
      "Si no apartas nada cada mes, no llegarás",
    );
    expect(plain(whenSentence("Unos cascos", 80, 90, 8))).toContain(
      "Ya tienes lo que cuesta unos cascos",
    );
    expect(plain(howMuchSentence("Unos cascos", 80, 16, 8))).toBe(
      "Te faltan 64 €. Para conseguir unos cascos en 8 meses, aparta 8 € al mes.",
    );
    expect(plain(howMuchSentence("Unos cascos", 80, 16, 0))).toBe(
      "Elige una fecha a partir del mes que viene.",
    );
  });
});
