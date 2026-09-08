import { cn } from "@/shared/lib/cn";
export function DetailTabs<T extends string>({
  tabs,
  value,
  onChange,
  panelId,
  label,
}: {
  tabs: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  panelId: string;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="border-line flex min-w-0 overflow-x-auto border-b"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.value}
          id={`${panelId}-${tab.value}`}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          aria-controls={panelId}
          tabIndex={tab.value === value ? 0 : -1}
          className={cn(
            "focus-visible:outline-brand shrink-0 border-b-2 border-transparent px-4 py-3 text-sm font-medium focus-visible:outline-2",
            tab.value === value
              ? "border-brand text-brand"
              : "text-ink-subtle hover:text-ink",
          )}
          onClick={() => onChange(tab.value)}
          onKeyDown={(event) => {
            const next =
              event.key === "ArrowRight"
                ? (index + 1) % tabs.length
                : event.key === "ArrowLeft"
                  ? (index + tabs.length - 1) % tabs.length
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? tabs.length - 1
                      : null;
            if (next === null) return;
            event.preventDefault();
            const target = tabs[next]!;
            document.getElementById(`${panelId}-${target.value}`)?.focus();
            onChange(target.value);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
