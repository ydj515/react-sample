import { Link } from "@tanstack/react-router";
import { documents } from "@/features/docs/model/documents";
import { cn } from "@/shared/lib/cn";

export function DocsNavigation({
  slug,
  onNavigate,
}: {
  slug: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="문서 탐색" className="space-y-7">
      {[...new Set(documents.map((doc) => doc.category))].map((category) => (
        <div key={category}>
          <p className="text-ink-subtle mb-2 px-3 text-xs font-semibold">
            {category}
          </p>
          <ul className="space-y-1">
            {documents
              .filter((doc) => doc.category === category)
              .map((doc) => (
                <li key={doc.slug}>
                  <Link
                    to="/docs/$slug"
                    params={{ slug: doc.slug }}
                    onClick={onNavigate}
                    aria-current={slug === doc.slug ? "page" : undefined}
                    className={cn(
                      "focus-visible:outline-brand rounded-control block px-3 py-2.5 text-sm",
                      slug === doc.slug
                        ? "bg-brand-soft text-brand font-semibold"
                        : "text-ink-muted hover:bg-surface-muted",
                    )}
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
