import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { navigationGroups } from "./navigation";
import { cn } from "@/shared/lib/cn";

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-control bg-brand text-on-brand grid size-9 shrink-0 place-items-center text-lg font-semibold">
        P
      </span>
      <div>
        <span className="text-ink block text-lg font-semibold tracking-tight">
          ProjectHub
        </span>
        <span className="text-ink-subtle block text-xs">
          프로젝트 · 업무 운영 관리
        </span>
      </div>
    </div>
  );
}

export function SidebarNavigation({
  activeGroup,
  compact,
  onNavigate,
}: {
  activeGroup: string;
  compact: boolean;
  onNavigate?: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(activeGroup);
  const id = useId();
  return (
    <nav
      aria-label="주요 메뉴"
      className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-5"
    >
      {navigationGroups.map((group, index) => {
        const open = expanded === group.label;
        return (
          <div key={group.label}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${id}-${index}`}
              onClick={() => setExpanded(open ? null : group.label)}
              className={cn(
                "rounded-control hover:bg-surface-muted focus-visible:outline-brand flex min-h-10 w-full items-center justify-between px-3 text-left text-xs font-semibold tracking-wide transition focus-visible:outline-2",
                activeGroup === group.label ? "text-ink" : "text-ink-subtle",
              )}
            >
              <span>{group.label}</span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-3.5 transition-transform",
                  !open && "-rotate-90",
                )}
              />
            </button>
            <div id={`${id}-${index}`} hidden={!open}>
              <div className="mt-1 grid gap-1">
                {group.items.map(({ icon: Icon, ...item }) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    activeOptions={{
                      exact: item.to === "/",
                      includeSearch: false,
                    }}
                    activeProps={{
                      "aria-current": "page",
                      className: "font-semibold",
                    }}
                    className={cn(
                      "aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand group rounded-control text-ink-muted hover:bg-surface-muted hover:text-ink focus-visible:outline-brand flex items-center gap-3 px-3 text-sm transition focus-visible:outline-2",
                      compact ? "min-h-9" : "min-h-10",
                    )}
                  >
                    <Icon
                      className="group-aria-[current=page]:text-brand size-[18px] shrink-0"
                      aria-hidden
                    />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
