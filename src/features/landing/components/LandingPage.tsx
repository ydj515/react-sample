import { useEffect, type ReactNode } from "react";
export function LandingPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | React Sample`;
    return () => {
      document.title = previous;
    };
  }, [title]);
  return (
    <div className="bg-surface text-ink min-h-screen">
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
