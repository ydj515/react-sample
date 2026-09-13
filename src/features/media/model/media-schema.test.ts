import { describe, expect, it } from "vitest";
import { validateUpload, folderTrail } from "./media-schema";

describe("media constraints", () => {
  it("accepts supported files and rejects empty, oversized and executable files", () => {
    expect(validateUpload({ size: 20, type: "text/plain" })).toBeNull();
    expect(validateUpload({ size: 0, type: "text/plain" })).not.toBeNull();
    expect(
      validateUpload({ size: 6 * 1024 * 1024, type: "image/png" }),
    ).not.toBeNull();
    expect(validateUpload({ size: 20, type: "text/html" })).not.toBeNull();
  });
  it("builds folder breadcrumbs without looping on cycles", () => {
    const folders = [
      { id: "a", name: "A", parentId: null },
      { id: "b", name: "B", parentId: "a" },
    ];
    expect(folderTrail(folders, "b").map((item) => item.name)).toEqual([
      "A",
      "B",
    ]);
    expect(folderTrail(folders, "missing")).toEqual([]);
    expect(
      folderTrail([{ id: "a", name: "A", parentId: "a" }], "a"),
    ).toHaveLength(1);
  });
});
