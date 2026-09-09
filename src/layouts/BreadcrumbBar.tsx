import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

import { currentNavigation } from "./navigation";

export function BreadcrumbBar({ pathname }: { pathname: string }) {
  const current = currentNavigation(pathname);
  const detail = pathname.split("/").filter(Boolean).length > 1;
  const detailLabel =
    pathname === "/products/new"
      ? "상품 등록"
      : pathname.endsWith("/edit")
        ? "상품 수정"
        : current?.to === "/users"
          ? "사용자 상세"
          : current?.to === "/orders"
            ? "주문 상세"
            : current?.to === "/products"
              ? "상품 상세"
              : "프로젝트 상세";
  return (
    <nav
      aria-label="현재 위치"
      className="bg-canvas text-ink-subtle flex min-h-11 min-w-0 items-center gap-2 px-4 text-xs sm:px-6"
    >
      <Link
        to="/"
        aria-label="홈"
        className="hover:text-brand shrink-0 rounded p-1"
      >
        <Home className="size-3.5" aria-hidden />
      </Link>
      <ChevronRight className="size-3 shrink-0" aria-hidden />
      <span className="shrink-0">{current?.group ?? "대시보드"}</span>
      <ChevronRight className="size-3 shrink-0" aria-hidden />
      {detail && current ? (
        <>
          <Link to={current.to} className="hover:text-brand">
            {current.label}
          </Link>
          <ChevronRight className="size-3 shrink-0" aria-hidden />
        </>
      ) : null}
      <span aria-current="page" className="text-ink truncate font-medium">
        {detail ? detailLabel : (current?.label ?? "페이지")}
      </span>
    </nav>
  );
}
