import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <section className="grid max-w-md gap-4 text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          404
        </p>
        <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다.</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          요청한 주소가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          to="/"
          className="mx-auto inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
        >
          대시보드로 이동
        </Link>
      </section>
    </main>
  );
}
