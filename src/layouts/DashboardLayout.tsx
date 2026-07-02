import { Link, Outlet } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { ThemeToggle } from "@/layouts/ThemeToggle";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { useUiStore } from "@/stores/ui-store";

const navItems = [
  { to: "/", label: "대시보드" },
  { to: "/projects", label: "프로젝트" },
  { to: "/settings", label: "설정" },
] as const;

export function DashboardLayout() {
  const density = useUiStore((state) => state.density);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const theme = useUiStore((state) => state.theme);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const sidebarId = "dashboard-sidebar";
  const isCompact = density === "compact";

  return (
    <div
      data-density={density}
      data-testid="dashboard-shell"
      data-theme={theme}
      className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100"
    >
      <aside
        id={sidebarId}
        aria-label="사이드바"
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-950",
          isCompact ? "p-3" : "p-4",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "font-semibold",
            isCompact ? "mb-6 text-base" : "mb-8 text-lg",
          )}
        >
          ProjectHub
        </div>
        <nav
          aria-label="주요 메뉴"
          className={cn("grid", isCompact ? "gap-0.5" : "gap-1")}
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                isCompact ? "px-2.5 py-1.5" : "px-3 py-2",
              )}
              activeProps={{
                className:
                  "bg-slate-950 text-white hover:bg-slate-950 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-100",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div
        data-testid="dashboard-content-shell"
        className={cn(
          "transition-[padding] duration-200",
          sidebarOpen ? "lg:pl-64" : "lg:pl-0",
        )}
      >
        <header
          className={cn(
            "sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90",
            isCompact ? "h-14 px-3" : "h-16 px-4",
          )}
        >
          <Button
            aria-controls={sidebarId}
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
            className="dark:text-slate-200 dark:hover:bg-slate-800"
            size="icon"
            type="button"
            variant="ghost"
            onClick={toggleSidebar}
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              React Sample Dashboard
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main
          className={cn(
            "mx-auto w-full max-w-7xl",
            isCompact
              ? "px-3 py-4 sm:px-4 lg:px-6"
              : "px-4 py-6 sm:px-6 lg:px-8",
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
