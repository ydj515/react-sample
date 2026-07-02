import { Link, Outlet } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useUiStore } from "@/stores/ui-store";

const navItems = [
  { to: "/", label: "대시보드" },
  { to: "/projects", label: "프로젝트" },
  { to: "/settings", label: "설정" },
] as const;

export function DashboardLayout() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white p-4 transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="mb-8 text-lg font-semibold">ProjectHub</div>
        <nav aria-label="주요 메뉴" className="grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              activeProps={{
                className: "bg-slate-950 text-white hover:bg-slate-950",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
          <Button
            aria-label="사이드바 열기"
            size="icon"
            type="button"
            variant="ghost"
            onClick={toggleSidebar}
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
          <div className="text-sm text-slate-500">React Sample Dashboard</div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
