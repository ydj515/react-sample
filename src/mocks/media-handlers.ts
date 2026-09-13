import { http, HttpResponse } from "msw";
import { folderInputSchema, validateUpload } from "@/features/media/model";
import type { Folder, MediaFile } from "@/features/media/model";
import { createMockApiError } from "./api-error";

function base64(bytes: Uint8Array) {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

const welcome = new TextEncoder().encode(
  "미디어 라이브러리 사용 안내\n파일을 선택하거나 드래그해서 업로드하세요.",
);

let folders: Folder[];

let files: MediaFile[];

let contents: Map<string, { type: MediaFile["type"]; base64: string }>;

export function resetMediaMockData() {
  folders = [
    { id: "folder-1", name: "프로젝트", parentId: null },
    { id: "folder-2", name: "브랜드", parentId: "folder-1" },
    { id: "folder-3", name: "자료", parentId: null },
  ];
  files = [
    {
      id: "file-1",
      name: "시작하기.txt",
      folderId: null,
      size: welcome.length,
      type: "text/plain",
      uploadedAt: "2026-09-01T09:00:00Z",
    },
  ];
  contents = new Map([
    ["file-1", { type: "text/plain", base64: base64(welcome) }],
  ]);
}
resetMediaMockData();
function error(request: Request, status: number, message: string) {
  return createMockApiError({
    status,
    code: status === 404 ? "MEDIA_NOT_FOUND" : "INVALID_MEDIA_INPUT",
    message,
    path: new URL(request.url).pathname,
  });
}

export const mediaHandlers = [
  http.get("/api/media", () => HttpResponse.json({ folders, files })),
  http.get("/api/media/:id/content", ({ params, request }) => {
    const content = contents.get(String(params.id));
    return content
      ? HttpResponse.json(content)
      : error(request, 404, "파일을 찾을 수 없습니다.");
  }),
  http.post("/api/media/folders", async ({ request }) => {
    const parsed = folderInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) return error(request, 400, "폴더 이름을 확인하세요.");
    if (
      parsed.data.parentId &&
      !folders.some((folder) => folder.id === parsed.data.parentId)
    ) {
      return error(request, 404, "상위 폴더를 찾을 수 없습니다.");
    }
    if (
      folders.some(
        (folder) =>
          folder.parentId === parsed.data.parentId &&
          folder.name === parsed.data.name,
      )
    ) {
      return error(request, 409, "같은 이름의 폴더가 있습니다.");
    }
    const folder = { ...parsed.data, id: crypto.randomUUID() };
    folders.push(folder);
    return HttpResponse.json(folder, { status: 201 });
  }),
  http.post("/api/media/files", async ({ request }) => {
    const form = await request.formData().catch(() => null);

    const file = form?.get("file");

    const folderId = form?.get("folderId") || null;
    if (
      !file ||
      typeof file === "string" ||
      (typeof folderId !== "string" && folderId !== null)
    ) {
      return error(request, 400, "파일을 선택하세요.");
    }
    const invalid = validateUpload(file);
    if (invalid) return error(request, 400, invalid);
    if (folderId && !folders.some((folder) => folder.id === folderId)) {
      return error(request, 404, "폴더를 찾을 수 없습니다.");
    }
    const item: MediaFile = {
      id: crypto.randomUUID(),
      name: file.name,
      folderId,
      type: file.type as MediaFile["type"],
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    const encoded = base64(new Uint8Array(await file.arrayBuffer()));
    contents.set(item.id, { type: item.type, base64: encoded });
    files.unshift(item);
    return HttpResponse.json(item, { status: 201 });
  }),
];
