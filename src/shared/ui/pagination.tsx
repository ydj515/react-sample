import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
export function Pagination({
  page,
  pages,
  total,
  pageSize = 8,
  onChange,
}: {
  page: number;
  pages: number;
  total: number;
  pageSize?: number;
  onChange: (page: number) => void;
}) {
  const count = Math.min(5, pages);
  const start = Math.max(1, Math.min(page - 2, pages - count + 1));
  return (
    <nav
      aria-label="목록 페이지"
      className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm"
    >
      <div className="text-ink-subtle flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tabular-nums">
        <p>
          {total ? (page - 1) * pageSize + 1 : 0}–
          {Math.min(page * pageSize, total)} / {total}건
        </p>
        <span aria-live="polite">
          {page} / {pages} 페이지
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="size-8 shrink-0 px-0"
          aria-label="이전 페이지"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
        {Array.from({ length: count }, (_, index) => start + index).map(
          (number) => (
            <Button
              key={number}
              type="button"
              size="sm"
              className="min-w-8 px-1.5"
              variant={number === page ? "primary" : "ghost"}
              aria-label={`${number}페이지`}
              aria-current={number === page ? "page" : undefined}
              onClick={() => onChange(number)}
            >
              {number}
            </Button>
          ),
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="size-8 shrink-0 px-0"
          aria-label="다음 페이지"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </nav>
  );
}
