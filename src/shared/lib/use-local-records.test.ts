import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { z } from "zod";
import { useLocalRecords } from "./use-local-records";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

it("protects malformed stored data", () => {
  localStorage.setItem("test-records", "invalid");
  const { result } = renderHook(() =>
    useLocalRecords("test-records", z.array(z.string()), () => []),
  );
  expect(result.current.blocked).toBe(true);
  expect(result.current.save(["new"])).toBe(false);
  expect(localStorage.getItem("test-records")).toBe("invalid");
});

it("does not report success or change state when storage fails", () => {
  const { result } = renderHook(() =>
    useLocalRecords("test-records", z.array(z.string()), () => []),
  );
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  act(() => {
    expect(result.current.save(["new"])).toBe(false);
  });
  expect(result.current.data).toEqual([]);
  expect(result.current.error).toContain("저장하지 못했습니다");
});
