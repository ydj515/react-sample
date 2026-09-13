import { File as NodeFile } from "node:buffer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFolder,
  getLibrary,
  getFileContent,
  uploadFile,
} from "./media-api";

describe("media API", () => {
  beforeEach(async () => {
    // jsdom FormData는 Node fetch의 multipart 직렬화와 호환되지 않는다.
    const nativeForm = await new Response("", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).formData();
    vi.stubGlobal("FormData", nativeForm.constructor);
    vi.stubGlobal("File", NodeFile);
  });
  afterEach(() => vi.unstubAllGlobals());
  it("creates nested folders and rejects duplicates or dangling parents", async () => {
    const folder = await createFolder({
      name: "새 폴더",
      parentId: "folder-1",
    });
    expect((await getLibrary()).folders).toContainEqual(folder);
    await expect(
      createFolder({ name: "새 폴더", parentId: "folder-1" }),
    ).rejects.toMatchObject({ status: 409 });
    await expect(
      createFolder({ name: "새 폴더", parentId: "missing" }),
    ).rejects.toMatchObject({ status: 404 });
    await expect(
      createFolder({ name: "", parentId: null }),
    ).rejects.toMatchObject({ status: 400 });
  });
  it("reads preview content and handles missing files", async () => {
    expect(await getFileContent("file-1")).toMatchObject({
      type: "text/plain",
    });
    await expect(getFileContent("missing")).rejects.toMatchObject({
      status: 404,
    });
  });
  it("uploads multipart file content into its selected folder", async () => {
    const file = new NodeFile(["hello"], "hello.txt", {
      type: "text/plain",
    }) as unknown as File;

    const result = await uploadFile(file, "folder-1");
    expect(result).toMatchObject({
      name: "hello.txt",
      folderId: "folder-1",
      size: 5,
    });
    expect(await getFileContent(result.id)).toEqual({
      type: "text/plain",
      base64: "aGVsbG8=",
    });
    await expect(uploadFile(file, "missing")).rejects.toMatchObject({
      status: 404,
    });
    await expect(
      uploadFile(
        new NodeFile(["x"], "x.html", { type: "text/html" }) as unknown as File,
        null,
      ),
    ).rejects.toMatchObject({ status: 400 });
  });
});
