import { readFile } from "node:fs/promises";
import process from "node:process";

import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const repositoryRoot = process.cwd();
const eslint = new ESLint({ cwd: repositoryRoot });

describe("tooling configuration", () => {
  it.each([
    "storybook-static/assets/story.js",
    "playwright-report/index.html",
    "test-results/results.json",
  ])("ignores generated output %s in ESLint", async (relativePath) => {
    expect(
      await eslint.isPathIgnored(`${repositoryRoot}/${relativePath}`),
    ).toBe(true);
  });

  it("keeps generated output in the Prettier ignore list", async () => {
    const content = await readFile(`${repositoryRoot}/.prettierignore`, "utf8");

    expect(content.split(/\r?\n/u)).toEqual(
      expect.arrayContaining([
        "storybook-static/",
        "playwright-report/",
        "test-results/",
      ]),
    );
  });

  it("keeps the MSW worker regeneration directory configured", async () => {
    const content = await readFile(`${repositoryRoot}/package.json`, "utf8");
    const packageJson = JSON.parse(content) as {
      msw?: { workerDirectory?: string[] };
    };

    expect(packageJson.msw?.workerDirectory).toEqual(["public"]);
  });

  it("rejects upward imports from shared code", async () => {
    const [result] = await eslint.lintText(
      'import "@/features/projects/api/project-api";\n',
      { filePath: `${repositoryRoot}/src/shared/lib/invalid-boundary.ts` },
    );

    expect(result?.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "no-restricted-imports" }),
      ]),
    );
  });

  it("rejects store imports from feature API code", async () => {
    const [result] = await eslint.lintText('import "@/stores/auth-store";\n', {
      filePath: `${repositoryRoot}/src/features/auth/api/invalid-boundary.ts`,
    });

    expect(result?.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "no-restricted-imports" }),
      ]),
    );
  });
});
