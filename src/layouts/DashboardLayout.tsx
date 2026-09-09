import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useRef, useState, useSyncExternalStore } from "react";

import { AppFooter } from "./AppFooter";
import { MobileBottomNavigation } from "./MobileBottomNavigation";
import { BreadcrumbBar } from "./BreadcrumbBar";
import { GlobalSearch } from "./GlobalSearch";
import { currentNavigation } from "./navigation";
import { SidebarBrand, SidebarNavigation } from "./SidebarNavigation";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

function subscribeMobile(callback: () => void) {
  const media = window.matchMedia("(max-width: 1023px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function getMobile() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

export function DashboardLayout() {
  const density = useUiStore((state) => state.density);
  const theme = useUiStore((state) => state.theme);
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mobile = useSyncExternalStore(subscribeMobile, getMobile, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const isCompact = density === "compact";
  const activeGroup = currentNavigation(pathname)?.group ?? "대시보드";
  // 데스크톱으로 전환했다가 돌아와도 모바일 서랍은 닫힌 상태로 시작한다.
  if (!mobile && mobileOpen) setMobileOpen(false);
  const email = user?.email ?? "데모 계정";
  const userName = email.split("@")[0] || "사용자";
  return (
    <div
      data-density={density}
      data-testid="dashboard-shell"
      data-theme={theme}
      className="bg-canvas text-ink min-h-screen transition-colors"
    >
      {!mobile ? (
        <aside
          id="dashboard-sidebar"
          aria-label="사이드바"
          className="border-line bg-surface text-ink fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r"
        >
          <div
            className={cn(
              "border-line flex shrink-0 items-center border-b px-5",
              isCompact ? "h-14" : "h-16",
            )}
          >
            <SidebarBrand />
          </div>
          <SidebarNavigation
            key={pathname}
            activeGroup={activeGroup}
            compact={isCompact}
          />
          <div className="border-line border-t px-5 py-4">
            <p className="text-ink-subtle text-xs font-semibold tracking-wide">
              PROJECTHUB WORKSPACE
            </p>
            <p className="text-ink-subtle mt-1.5 text-xs">
              프로젝트와 업무를 한곳에서
            </p>
          </div>
        </aside>
      ) : null}
      {mobile ? (
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogContent
            id="dashboard-mobile-sidebar"
            className="bg-surface text-ink top-0 left-0 flex h-dvh w-72 max-w-[calc(100vw-2rem)] translate-x-0 translate-y-0 flex-col rounded-none p-0"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              menuRef.current?.focus();
            }}
          >
            <DialogTitle className="sr-only">전체 메뉴</DialogTitle>
            <DialogDescription className="sr-only">
              이동할 메뉴를 선택하세요.
            </DialogDescription>
            <div className="border-line flex items-center justify-between gap-2 border-b px-4 py-3">
              <SidebarBrand />
              <button
                type="button"
                aria-label="사이드바 닫기"
                className="rounded-control text-ink-subtle hover:bg-surface-muted focus-visible:outline-brand grid size-9 shrink-0 place-items-center focus-visible:outline-2"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <SidebarNavigation
              key={pathname}
              activeGroup={activeGroup}
              compact={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      <div
        data-testid="dashboard-content-shell"
        className="flex min-h-screen min-w-0 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0 lg:pl-64"
      >
        <header
          aria-label="앱 도구 모음"
          className={cn(
            "border-line bg-surface sticky top-0 z-20 grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b px-3 sm:gap-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto]",
            isCompact ? "h-14" : "h-16",
          )}
        >
          <div className="min-w-0 lg:hidden">
            {mobile ? (
              <button
                ref={menuRef}
                type="button"
                aria-controls="dashboard-mobile-sidebar"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "사이드바 닫기" : "사이드바 열기"}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-control text-ink-subtle hover:bg-surface-muted focus-visible:outline-brand grid size-10 place-items-center focus-visible:outline-2"
              >
                <Menu className="size-5" aria-hidden />
              </button>
            ) : null}
          </div>
          <div className="w-full max-w-lg min-w-0">
            <GlobalSearch />
          </div>
          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <ThemeToggle />
            <div
              role="group"
              aria-label="로그인 사용자"
              className="border-line flex min-w-0 items-center gap-2 border-l pl-2 sm:pl-3"
            >
              <span
                title={email}
                className="bg-brand-soft text-brand grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold"
              >
                {userName.charAt(0).toUpperCase()}
              </span>
              <div className="hidden max-w-36 min-w-0 lg:block">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="text-ink-subtle mt-0.5 truncate text-xs">
                  {email}
                </p>
              </div>
              <span className="sr-only lg:hidden">{email}</span>
            </div>
            <Button
              aria-label="로그아웃"
              className="shrink-0"
              size="icon"
              variant="ghost"
              onClick={() => {
                signOut();
                void navigate({ to: "/signin" });
              }}
            >
              <LogOut className="size-4" aria-hidden />
            </Button>
          </div>
        </header>
        <BreadcrumbBar pathname={pathname} />
        <main
          className={cn(
            "mx-auto w-full max-w-7xl min-w-0 flex-1",
            isCompact ? "px-3 py-4 sm:px-4 lg:px-6" : "px-4 py-6 sm:px-6",
          )}
        >
          <Outlet />
        </main>
        {mobile ? <MobileBottomNavigation /> : <AppFooter />}
      </div>
    </div>
  );
}
