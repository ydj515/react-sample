import {
  librarySchema,
  mediaFileSchema,
  folderSchema,
  contentSchema,
} from "@/features/media/model/media-schema";
import { apiRequest } from "@/shared/api/http-client";

export const getLibrary = () =>
  apiRequest("/api/media", { schema: librarySchema });

export const getFileContent = (id: string) =>
  apiRequest(`/api/media/${encodeURIComponent(id)}/content`, {
    schema: contentSchema,
  });

export function createFolder(input: { name: string; parentId: string | null }) {
  return apiRequest("/api/media/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    schema: folderSchema,
  });
}

export function uploadFile(file: File, folderId: string | null) {
  const body = new FormData();
  body.append("file", file);
  if (folderId) body.append("folderId", folderId);
  return apiRequest("/api/media/files", {
    method: "POST",
    body,
    schema: mediaFileSchema,
  });
}
