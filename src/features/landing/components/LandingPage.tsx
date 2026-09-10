import { PageMetadata } from "@/shared/ui/page-metadata";
import { type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export function LandingPage({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-surface text-ink min-h-screen", className)}>
      <PageMetadata title={title} />
      <a
        href="#landing-main"
        className="bg-brand text-on-brand rounded-control sr-only top-2 left-2 z-[60] focus:not-sr-only focus:fixed focus:p-3"
      >
        본문으로 건너뛰기
      </a>
      {children}
    </div>
  );
}
