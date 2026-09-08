import { describe, expect, it } from "vitest";
import { listSearchSchema, paginate, matchesSearch } from "./list-search";
describe("list search", () => {
  it("잘못된 URL 값을 기본값으로 정규화한다", () => {
    expect(listSearchSchema.parse({ q: 3, sort: "bad", page: -1 })).toEqual({
      q: "",
      sort: "newest",
      page: 1,
    });
    expect(listSearchSchema.parse({ page: "2" }).page).toBe(2);
    expect(listSearchSchema.parse({ page: 1.5 }).page).toBe(1);
  });
  it("빈 목록과 범위를 벗어난 페이지를 유효 범위로 맞춘다", () => {
    expect(paginate([], 10)).toMatchObject({
      items: [],
      page: 1,
      pages: 1,
      total: 0,
    });
    expect(paginate([1, 2, 3, 4, 5], 10, 2)).toMatchObject({
      items: [5],
      page: 3,
    });
    expect(paginate([1, 2, 3], -1, 2).items).toEqual([1, 2]);
  });
  it("이름, 이메일, 태그를 대소문자와 주변 공백에 상관없이 검색한다", () => {
    expect(matchesSearch(" SAMPLE ", "홍길동", "sample@example.com")).toBe(
      true,
    );
    expect(matchesSearch("없는값", "Sample")).toBe(false);
  });
});
