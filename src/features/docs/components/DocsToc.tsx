import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { DocSection } from "../model/documents";

export function DocsToc({ sections }: { sections: DocSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -55% 0px" },
    );
    sections.forEach((section) => {
      const heading = document.getElementById(section.id);
      if (heading) observer.observe(heading);
    });
    return () => observer.disconnect();
  }, [sections]);
  return (
    <nav aria-label="이 페이지의 목차">
      <p className="text-ink mb-4 text-xs font-semibold">이 페이지에서</p>
      <ul className="border-line space-y-1 border-l">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              onClick={() => setActive(section.id)}
              className={cn(
                "focus-visible:outline-brand -ml-px block border-l-2 px-4 py-2 text-xs leading-5",
                active === section.id
                  ? "border-brand text-brand font-medium"
                  : "text-ink-subtle hover:text-ink border-transparent",
              )}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
