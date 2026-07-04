import type { ErrorComponentProps } from "@tanstack/react-router";

/**
 * 라우트 트리에서 발생한 렌더링/로더 에러를 처리하는 폴백 화면.
 * TanStack Router의 errorComponent로 사용되며, reset으로 재시도할 수 있다.
 */
export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <section className="grid max-w-md gap-4 text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Error
        </p>
        <h1 className="text-2xl font-semibold">문제가 발생했습니다.</h1>
        <p className="text-sm break-words text-slate-500 dark:text-slate-400">
          {message}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mx-auto inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}
