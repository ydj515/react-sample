import { Link } from "@tanstack/react-router";

import { navigationCommands, type NavigationItem } from "@/layouts/navigation";
import { cn } from "@/shared/lib/cn";

const shortLabels: Partial<Record<NavigationItem["to"], string>> = {
  "/": "홈",
  "/operations": "운영",
  "/reports": "분석",
  "/projects": "프로젝트",
  "/settings": "설정",
};

export function MobileBottomNavigation({ className }: { className?: string }) {
  return (
    <nav
      aria-label="하단 메뉴"
      className={cn(
        "border-line bg-surface fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t px-2 pb-[env(safe-area-inset-bottom)]",
        className,
      )}
    >
      {navigationCommands
        .filter((item) => shortLabels[item.to])
        .map(({ to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/", includeSearch: false }}
            activeProps={{ "aria-current": "page" }}
            className="text-ink-subtle hover:text-ink focus-visible:outline-brand aria-[current=page]:text-brand flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 text-xs font-medium focus-visible:outline-2 focus-visible:-outline-offset-4"
          >
            <Icon className="size-5" aria-hidden />
            <span>{shortLabels[to]}</span>
          </Link>
        ))}
    </nav>
  );
}
