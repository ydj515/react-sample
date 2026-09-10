import { PageMetadata } from "@/shared/ui/page-metadata";
import type { ErrorComponentProps } from "@tanstack/react-router";

/**
 * 라우트 트리에서 발생한 렌더링/로더 에러를 처리하는 폴백 화면.
 * TanStack Router의 errorComponent로 사용되며, reset으로 재시도할 수 있다.
 */
export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

  return (
    <main className="bg-surface-muted text-ink grid min-h-screen place-items-center px-4">
      <PageMetadata
        title="문제가 발생했습니다"
        description="요청을 처리하지 못했습니다. 다시 시도해 주세요."
      />
      <section className="grid max-w-md gap-4 text-center">
        <p className="text-ink-subtle text-sm font-medium">Error</p>
        <h1 className="text-2xl font-semibold">문제가 발생했습니다.</h1>
        <p className="text-ink-subtle text-sm break-words">{message}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-control bg-brand text-on-brand hover:bg-brand-hover mx-auto inline-flex h-10 items-center justify-center px-4 text-sm font-medium"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}
