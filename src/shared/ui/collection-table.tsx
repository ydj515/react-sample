import type { ReactNode } from "react";

export function CollectionTable({
  label,
  children,
  minWidth = 720,
  scrollLabel,
}: {
  label: string;
  children: ReactNode;
  minWidth?: number;
  scrollLabel?: string;
}) {
  return (
    <div
      role="region"
      aria-label={scrollLabel ?? `${label} 스크롤`}
      tabIndex={0}
      className="rounded-panel border-line bg-surface focus-visible:outline-brand overflow-x-auto border focus-visible:outline-2"
    >
      <table
        style={{ minWidth }}
        className="[&_thead]:bg-surface-muted [&_thead]:text-ink-subtle [&_tbody_tr]:border-line [&_tbody_tr:hover]:bg-surface-muted [&_tfoot]:border-line [&_tfoot]:bg-surface-muted w-full text-left text-sm [&_tbody_th]:py-4 [&_tbody_tr]:border-t [&_td]:px-4 [&_td]:py-4 [&_tfoot]:border-t [&_th]:px-4 [&_thead_th]:py-3 [&_thead_th]:font-medium [&_thead_th]:whitespace-nowrap"
      >
        <caption className="sr-only">{label}</caption>
        {children}
      </table>
    </div>
  );
}
