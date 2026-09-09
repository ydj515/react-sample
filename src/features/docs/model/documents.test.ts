import { describe, expect, it } from "vitest";
import { documents, findDocument, searchDocuments } from "./documents";

describe("documentation catalog", () => {
  it("문서와 섹션에 고유한 URL을 제공한다", () => {
    expect(new Set(documents.map((doc) => doc.slug)).size).toBe(
      documents.length,
    );
    for (const doc of documents) {
      expect(new Set(doc.sections.map((section) => section.id)).size).toBe(
        doc.sections.length,
      );
      expect(doc.sections.length).toBeGreaterThanOrEqual(3);
    }
    expect(findDocument("missing")).toBeUndefined();
    expect(findDocument("getting-started")?.title).toBe(
      "React Sample 시작하기",
    );
  });
  it("제목과 본문을 검색하고 공백과 대소문자를 정규화한다", () => {
    expect(
      searchDocuments("  TANSTACK  ").some(
        (result) => result.slug === "server-state",
      ),
    ).toBe(true);
    expect(searchDocuments("키보드").length).toBeGreaterThan(0);
    expect(searchDocuments("없는문서xyz")).toEqual([]);
    expect(searchDocuments("  ")).toEqual([]);
  });
});
