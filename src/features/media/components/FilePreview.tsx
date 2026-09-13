import { useQuery } from "@tanstack/react-query";
import type { MediaFile } from "@/features/media/model/media-schema";
import { contentOptions } from "@/features/media/queries/media-queries";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { QueryFeedback } from "@/shared/ui/query-feedback";

export function FilePreview({
  file,
  onClose,
}: {
  file: MediaFile;
  onClose: () => void;
}) {
  const query = useQuery(contentOptions(file.id));

  const content = query.data;

  const src = content ? `data:${content.type};base64,${content.base64}` : "";
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[85dvh] max-w-3xl overflow-auto">
        <DialogTitle className="text-lg font-semibold break-all">
          {file.name}
        </DialogTitle>
        <DialogDescription className="text-ink-subtle mt-2 text-sm">
          {file.type} · {file.size.toLocaleString("ko-KR")} bytes
        </DialogDescription>
        <div className="my-5">
          <QueryFeedback
            pending={query.isPending}
            error={query.error}
            onRetry={() => {
              void query.refetch();
            }}
          />
          {content &&
            (content.type.startsWith("image/") ? (
              <img
                src={src}
                alt={file.name}
                className="mx-auto max-h-[55dvh] max-w-full object-contain"
              />
            ) : (
              <pre className="bg-surface-muted max-h-[55dvh] overflow-auto rounded p-4 text-sm break-words whitespace-pre-wrap">
                {new TextDecoder().decode(
                  Uint8Array.from(atob(content.base64), (character) =>
                    character.charCodeAt(0),
                  ),
                )}
              </pre>
            ))}
        </div>
        <div className="flex items-center justify-end gap-4">
          {content && (
            <a
              href={src}
              download={file.name}
              className="text-brand text-sm underline"
            >
              다운로드
            </a>
          )}
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
