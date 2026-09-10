import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

describe("environment configuration", () => {
  it("enables mocks in development but disables them in production by default", () => {
    expect(parseEnv({ PROD: false }).VITE_ENABLE_MOCKS).toBe(true);
    expect(parseEnv({ PROD: true }).VITE_ENABLE_MOCKS).toBe(false);
  });
  it("honors explicit demo and real API settings", () => {
    expect(
      parseEnv({ PROD: true, VITE_ENABLE_MOCKS: "true" }).VITE_ENABLE_MOCKS,
    ).toBe(true);
    expect(
      parseEnv({ PROD: false, VITE_ENABLE_MOCKS: "false" }).VITE_ENABLE_MOCKS,
    ).toBe(false);
    expect(parseEnv({}).VITE_API_BASE_URL).toBe("http://localhost:3000");
  });
  it.each([
    "ftp://example.com",
    "https://user:password@example.com",
    "https://example.com?token=x",
    "https://example.com/#hash",
    "invalid",
  ])("rejects an invalid API base: %s", (url) => {
    expect(() => parseEnv({ VITE_API_BASE_URL: url })).toThrow();
  });
});
