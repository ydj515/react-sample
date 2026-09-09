import { expect, it } from "vitest";
import { readingProgress } from "./reading-progress";
it("스크롤 가능 높이를 기준으로 진행률을 계산하고 범위를 제한한다", () => {
  expect(readingProgress(0, 2000, 1000)).toBe(0);
  expect(readingProgress(500, 2000, 1000)).toBe(50);
  expect(readingProgress(1000, 2000, 1000)).toBe(100);
  expect(readingProgress(-50, 2000, 1000)).toBe(0);
  expect(readingProgress(1200, 2000, 1000)).toBe(100);
  expect(readingProgress(0, 800, 1000)).toBe(100);
});
