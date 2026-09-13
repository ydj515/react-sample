import { resetCmsMockData } from "@/mocks/cms-handlers";
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import {
  resetProjectsMockData,
  resetManagementMockData,
  resetNotificationsMockData,
  resetKanbanMockData,
  server,
} from "@/mocks/server";

// jsdom은 스크롤 레이아웃과 IntersectionObserver를 구현하지 않는다.
// 실제 스크롤은 Playwright에서 검증하고, 테스트에서는 알림/문서 무한 스크롤을
// 안전하게 비활성화하기 위한 noop 스텁을 설치한다.
window.scrollTo = vi.fn();
if (typeof window.IntersectionObserver === "undefined") {
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin = "0px";
    readonly scrollMargin = "0px";
    readonly thresholds: ReadonlyArray<number> = [0];
    observe() {}
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    disconnect() {}
  }
  globalThis.IntersectionObserver = IntersectionObserverStub;
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  resetCmsMockData();
  resetProjectsMockData();
  resetManagementMockData();
  resetNotificationsMockData();
  resetKanbanMockData();
});

afterAll(() => {
  server.close();
});
