import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <main className="bg-surface-muted text-ink grid min-h-screen place-items-center px-4">
      <section className="grid max-w-md gap-4 text-center">
        <p className="text-ink-subtle text-sm font-medium">404</p>
        <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다.</h1>
        <p className="text-ink-subtle text-sm">
          요청한 주소가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          to="/"
          className="rounded-control bg-brand text-on-brand hover:bg-brand-hover mx-auto inline-flex h-10 items-center justify-center px-4 text-sm font-medium"
        >
          대시보드로 이동
        </Link>
      </section>
    </main>
  );
}
