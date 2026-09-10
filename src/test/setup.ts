import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import {
  resetProjectsMockData,
  resetManagementMockData,
  server,
} from "@/mocks/server";

// jsdom은 스크롤 레이아웃을 구현하지 않는다. 실제 스크롤은 Playwright에서 검증한다.
window.scrollTo = vi.fn();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  resetProjectsMockData();
  resetManagementMockData();
});

afterAll(() => {
  server.close();
});
