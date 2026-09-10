import { describe, expect, it, vi } from "vitest";
import { reportRenderError } from "./error-reporting";

describe("render error reporting", () => {
  it("reports classification and component location without raw error messages", () => {
    const report = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      reportRenderError("caught", new Error("private payload"), "at Example");
      expect(report).toHaveBeenCalledWith("React rendering error", {
        kind: "caught",
        name: "Error",
        componentStack: "at Example",
      });
      expect(JSON.stringify(report.mock.calls)).not.toContain(
        "private payload",
      );
    } finally {
      report.mockRestore();
    }
  });
});
