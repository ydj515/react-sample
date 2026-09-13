import { z } from "zod";

export const mediaTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
  "text/markdown",
] as const;

export const maxUploadSize = 5 * 1024 * 1024;

export const folderSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable(),
});

export const folderInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "폴더 이름을 입력하세요.")
    .max(80)
    .refine(
      (value) => !/[\\/]/.test(value),
      "경로 구분자는 사용할 수 없습니다.",
    ),
  parentId: z.string().nullable(),
});

export const mediaFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  folderId: z.string().nullable(),
  size: z.number().int().nonnegative(),
  type: z.enum(mediaTypes),
  uploadedAt: z.string(),
});

export const librarySchema = z.object({
  folders: folderSchema.array(),
  files: mediaFileSchema.array(),
});

export const contentSchema = z.object({
  type: z.enum(mediaTypes),
  base64: z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/),
});

export const mediaSearchSchema = z.object({
  folder: z.string().catch(""),
  q: z.string().catch(""),
});

export type Folder = z.infer<typeof folderSchema>;

export type MediaFile = z.infer<typeof mediaFileSchema>;

export function validateUpload(file: { size: number; type: string }) {
  if (!mediaTypes.includes(file.type as (typeof mediaTypes)[number])) {
    return "PNG, JPEG, WebP, TXT, Markdown 파일만 업로드할 수 있습니다.";
  }
  if (file.size === 0) return "빈 파일은 업로드할 수 없습니다.";
  if (file.size > maxUploadSize) {
    return "파일당 최대 5MB까지 업로드할 수 있습니다.";
  }
  return null;
}

export function folderTrail(folders: Folder[], id: string) {
  const trail: Folder[] = [];

  const seen = new Set<string>();

  let current = folders.find((folder) => folder.id === id);
  while (current && !seen.has(current.id)) {
    trail.unshift(current);
    seen.add(current.id);
    current = folders.find((folder) => folder.id === current?.parentId);
  }
  return trail;
}
