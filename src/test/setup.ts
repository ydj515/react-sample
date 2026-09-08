import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";

import {
  resetProjectsMockData,
  resetManagementMockData,
  server,
} from "@/mocks/server";

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
