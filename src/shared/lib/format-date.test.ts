import { describe, expect, it } from "vitest";

import { formatDate } from "@/shared/lib/format-date";

describe("formatDate", () => {
  it("ISO 날짜를 한국어 UI에 맞는 짧은 날짜로 변환한다", () => {
    expect(formatDate("2026-07-02")).toBe("2026. 07. 02.");
  });
});
