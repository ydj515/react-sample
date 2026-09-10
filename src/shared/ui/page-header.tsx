import { PageMetadata } from "./page-metadata";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <PageMetadata
        title={title}
        description={typeof description === "string" ? description : undefined}
      />
      <div className="min-w-0">
        <h1 className="text-ink text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-ink-subtle mt-2 text-sm leading-6">{description}</p>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
