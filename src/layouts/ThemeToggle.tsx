import { Moon, Sun } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useUiStore } from "@/stores/ui-store";

export function ThemeToggle() {
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const isDark = theme === "dark";
  const label = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <Button
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className="text-ink-subtle hover:bg-surface-muted hover:text-ink shrink-0 border border-transparent bg-transparent"
      size="icon"
      type="button"
      variant="ghost"
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="size-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="size-[18px] fill-current" aria-hidden="true" />
      )}
    </Button>
  );
}
