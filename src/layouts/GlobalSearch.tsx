import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";
import {
  useCallback,
  useEffectEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { searchNavigation } from "./navigation";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const listId = useId();
  const navigate = useNavigate();
  const results = searchNavigation(query);
  const shortcut =
    typeof navigator !== "undefined" && /mac/i.test(navigator.platform)
      ? "⌘ K"
      : "Ctrl K";
  const changeOpen = useCallback((next: boolean) => {
    if (next) {
      restoreFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setQuery("");
      setActive(0);
    }
    setOpen(next);
  }, []);
  const toggleFromShortcut = useEffectEvent(() => changeOpen(!open));
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.altKey ||
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      )
        return;
      event.preventDefault();
      toggleFromShortcut();
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  const select = (index: number) => {
    const item = results[index];
    if (!item) return;
    void navigate({ to: item.to });
    changeOpen(false);
  };
  useEffect(() => {
    if (open)
      document
        .getElementById(`${listId}-${active}`)
        ?.scrollIntoView?.({ block: "nearest" });
  }, [active, listId, open]);
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="메뉴 및 화면 검색 열기"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => changeOpen(true)}
        className="compact:h-9 rounded-control border-line bg-surface-muted text-ink-subtle hover:border-line-strong hover:bg-surface-muted focus-visible:outline-brand flex h-10 w-full min-w-0 items-center gap-2.5 border px-3 text-sm transition focus-visible:outline-2"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-left">
          <span className="sm:hidden">메뉴 검색</span>
          <span className="hidden sm:inline">메뉴 또는 화면 검색…</span>
        </span>
        <kbd className="border-line bg-surface hidden shrink-0 rounded border px-1.5 py-0.5 text-xs sm:inline">
          {shortcut}
        </kbd>
      </button>
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent
          className="top-20 max-w-xl translate-y-0 overflow-hidden p-0"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            (restoreFocus.current?.isConnected
              ? restoreFocus.current
              : triggerRef.current
            )?.focus();
          }}
        >
          <DialogTitle className="sr-only">빠른 이동</DialogTitle>
          <DialogDescription className="sr-only">
            메뉴 이름으로 검색하고 방향키와 Enter로 화면을 이동합니다. Escape로
            닫습니다.
          </DialogDescription>
          <div className="border-line flex items-center gap-3 border-b px-4 py-3">
            <Search className="text-ink-subtle size-5 shrink-0" aria-hidden />
            <input
              ref={inputRef}
              role="combobox"
              aria-label="메뉴 및 화면 검색"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={
                results.length ? `${listId}-${active}` : undefined
              }
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return;
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((value) =>
                    results.length
                      ? (value +
                          (event.key === "ArrowDown"
                            ? 1
                            : results.length - 1)) %
                        results.length
                      : 0,
                  );
                }
                if (event.key === "Enter") {
                  event.preventDefault();
                  select(active);
                }
              }}
              autoComplete="off"
              placeholder="이동할 메뉴를 입력하세요…"
              className="placeholder:text-ink-subtle h-10 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <Button
              size="icon"
              variant="ghost"
              aria-label="검색 닫기"
              onClick={() => changeOpen(false)}
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
          <div
            className="max-h-[min(24rem,55dvh)] overflow-y-auto p-2"
            role="listbox"
            id={listId}
            aria-label="검색 결과"
          >
            {results.map((item, index) => (
              <button
                key={item.to}
                type="button"
                role="option"
                id={`${listId}-${index}`}
                aria-selected={index === active}
                tabIndex={-1}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => select(index)}
                className={`rounded-control flex min-h-14 w-full items-center gap-3 px-3 text-left ${index === active ? "bg-brand-soft text-brand" : "text-ink-muted hover:bg-surface-muted"}`}
              >
                <item.icon className="size-5 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="text-ink-subtle mt-0.5 block text-xs">
                    {item.group}
                  </span>
                </span>
                <ArrowRight className="size-4" aria-hidden />
              </button>
            ))}
          </div>
          {!results.length ? (
            <p
              role="status"
              className="text-ink-subtle px-4 py-8 text-center text-sm"
            >
              일치하는 화면이 없습니다.
            </p>
          ) : null}
          <p className="border-line text-ink-subtle border-t px-4 py-3 text-xs">
            ↑ ↓ 선택 · Enter 이동 · Esc 닫기
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
