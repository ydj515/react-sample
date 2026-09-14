import { useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, Image as ImageIcon } from "lucide-react";
import {
  libraryOptions,
  useMediaMutations,
} from "@/features/media/queries/media-queries";
import {
  mediaSearchSchema,
  folderInputSchema,
  folderTrail,
  validateUpload,
  mediaTypes,
} from "@/features/media/model/media-schema";
import type { MediaFile } from "@/features/media/model/media-schema";
import { FolderTree } from "@/features/media/components/FolderTree";
import { FilePreview } from "@/features/media/components/FilePreview";
import { PageHeader } from "@/shared/ui/page-header";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { QueryBoundary } from "@/shared/ui/query-boundary";
import { EmptyState } from "@/shared/ui/empty-state";
import { cn } from "@/shared/lib/cn";

function MediaContent() {
  const { data } = useSuspenseQuery(libraryOptions());

  const search = mediaSearchSchema.parse(useSearch({ strict: false }));

  const navigate = useNavigate();

  const { folder, upload } = useMediaMutations();

  const [preview, setPreview] = useState<MediaFile | null>(null);

  const [dragOver, setDragOver] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState({
    completed: 0,
    total: 0,
  });

  const [messages, setMessages] = useState<string[]>([]);

  const [errors, setErrors] = useState<string[]>([]);

  const uploadLock = useRef(false);

  const form = useForm<{ name: string }>({
    resolver: zodResolver(folderInputSchema.pick({ name: true })),
    defaultValues: { name: "" },
  });

  const update = (patch: Partial<typeof search>) => {
    void navigate({
      to: "/files",
      search: { ...search, ...patch },
      replace: true,
    });
  };

  const validFolder =
    !search.folder || data.folders.some((item) => item.id === search.folder);

  const files = data.files.filter(
    (file) =>
      (!search.folder || file.folderId === search.folder) &&
      file.name
        .toLocaleLowerCase()
        .includes(search.q.trim().toLocaleLowerCase()),
  );

  async function uploadFiles(selected: File[]) {
    if (uploadLock.current || !validFolder) return;
    uploadLock.current = true;
    setUploading(true);
    setUploadProgress({ completed: 0, total: selected.length });
    setMessages([]);
    setErrors([]);
    try {
      const results = await Promise.allSettled(
        selected.map(async (file) => {
          try {
            const invalid = validateUpload(file);
            if (invalid) throw new Error(invalid);
            await upload.mutateAsync({ file, folderId: search.folder || null });
            return file.name;
          } finally {
            setUploadProgress((previous) => ({
              ...previous,
              completed: previous.completed + 1,
            }));
          }
        }),
      );
      results.forEach((result, index) => {
        const file = selected[index]!;
        if (result.status === "fulfilled") {
          setMessages((previous) => [...previous, `${file.name} 업로드 완료`]);
        } else {
          setErrors((previous) => [
            ...previous,
            `${file.name}: ${result.reason instanceof Error ? result.reason.message : "업로드 실패"}`,
          ]);
        }
      });
    } finally {
      uploadLock.current = false;
      setUploading(false);
    }
  }
  return (
    <section className="grid gap-6">
      <PageHeader
        title="파일 관리자"
        description="폴더별로 자료를 정리하고 이미지와 문서를 미리 보세요."
      />
      <div className="grid min-w-0 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="self-start p-4">
          <FolderTree
            folders={data.folders}
            selected={search.folder}
            onSelect={(id) => update({ folder: id, q: "" })}
          />
        </Card>
        <div className="grid min-w-0 content-start gap-4">
          <nav aria-label="폴더 경로" className="flex flex-wrap gap-2 text-sm">
            <button
              type="button"
              className="text-brand underline"
              onClick={() => update({ folder: "", q: "" })}
            >
              전체 파일
            </button>
            {folderTrail(data.folders, search.folder).map((item) => (
              <span key={item.id}>
                /{" "}
                <button
                  type="button"
                  className="text-brand underline"
                  onClick={() => update({ folder: item.id, q: "" })}
                >
                  {item.name}
                </button>
              </span>
            ))}
          </nav>
          {!validFolder && (
            <Card role="alert" className="p-4">
              폴더를 찾을 수 없습니다.{" "}
              <button
                className="text-brand underline"
                type="button"
                onClick={() => update({ folder: "" })}
              >
                전체 파일로 이동
              </button>
            </Card>
          )}
          <label className="grid gap-2 text-sm">
            파일 검색
            <Input
              value={search.q}
              onChange={(event) => update({ q: event.target.value })}
            />
          </label>
          <form
            noValidate
            className="flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              void form.handleSubmit(({ name }) =>
                folder.mutate(
                  { name, parentId: search.folder || null },
                  { onSuccess: () => form.reset() },
                ),
              )(event);
            }}
          >
            <label className="grid flex-1 gap-2 text-sm">
              새 폴더 이름
              <Input
                {...form.register("name")}
                disabled={!validFolder || folder.isPending}
                aria-invalid={!!form.formState.errors.name}
              />
            </label>
            <Button type="submit" disabled={!validFolder || folder.isPending}>
              폴더 만들기
            </Button>
            {form.formState.errors.name && (
              <p role="alert" className="text-negative w-full text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
            {folder.error && (
              <p role="alert" className="text-negative w-full text-sm">
                {folder.error.message}
              </p>
            )}
          </form>
          <div
            role="region"
            aria-label="파일 업로드 영역"
            aria-busy={uploading}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              void uploadFiles(Array.from(event.dataTransfer.files));
            }}
            className={cn(
              "rounded-xl border-2 border-dashed p-6 text-center",
              dragOver ? "border-brand bg-brand-soft" : "border-line",
            )}
          >
            <Upload
              aria-hidden
              className="text-ink-subtle mx-auto mb-3 size-6"
            />
            <p className="text-sm">파일을 여기로 끌어 놓거나 선택하세요.</p>
            <p className="text-ink-subtle mt-2 text-xs">
              PNG · JPEG · WebP · TXT · Markdown / 파일당 5MB
            </p>
            <label className="mt-4 grid gap-2 text-sm">
              업로드할 파일
              <Input
                type="file"
                multiple
                accept={mediaTypes.join(",")}
                disabled={uploading || !validFolder}
                onChange={(event) => {
                  const selected = Array.from(event.target.files ?? []);
                  event.target.value = "";
                  void uploadFiles(selected);
                }}
              />
            </label>
          </div>
          {uploading && (
            <div className="grid gap-2" role="status" aria-live="polite">
              <p className="text-sm">파일을 업로드하는 중입니다…</p>
              <progress
                aria-label="파일 업로드 진행률"
                max={uploadProgress.total}
                value={uploadProgress.completed}
                className="h-2 w-full"
              />
              <p className="text-ink-subtle text-xs">
                {uploadProgress.completed}/{uploadProgress.total}개 완료
              </p>
            </div>
          )}
          {!!messages.length && (
            <ul role="status" className="text-sm">
              {messages.map((message, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          )}
          {!!errors.length && (
            <ul role="alert" className="text-negative text-sm">
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          )}
          <p className="text-ink-subtle text-sm">{files.length}개 파일</p>
          {!files.length && (
            <EmptyState
              title="파일이 없습니다."
              description="파일을 업로드하거나 검색 조건을 변경하세요."
              onReset={() => update({ q: "" })}
            />
          )}
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {files.map((file) => (
              <Card key={file.id} className="min-w-0 p-4">
                <button
                  type="button"
                  className="grid w-full gap-3 text-left"
                  onClick={() => setPreview(file)}
                  aria-label={`${file.name} 미리보기`}
                >
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="text-brand size-8" aria-hidden />
                  ) : (
                    <FileText className="text-brand size-8" aria-hidden />
                  )}
                  <span className="text-sm font-medium break-all">
                    {file.name}
                  </span>
                  <span className="text-ink-subtle text-xs">
                    {Math.max(1, Math.ceil(file.size / 1024))} KB ·{" "}
                    {file.uploadedAt.slice(0, 10)}
                  </span>
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {preview && (
        <FilePreview file={preview} onClose={() => setPreview(null)} />
      )}
    </section>
  );
}

export function MediaPage() {
  return (
    <QueryBoundary>
      <MediaContent />
    </QueryBoundary>
  );
}
