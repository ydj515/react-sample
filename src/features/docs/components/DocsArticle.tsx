import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock3, Info } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { documents, type DocArticle } from "../model/documents";

export function DocsArticle({ article }: { article: DocArticle }) {
  const index = documents.findIndex((doc) => doc.slug === article.slug);
  const previous = documents[index - 1];
  const next = documents[index + 1];
  return (
    <article className="min-w-0">
      <header className="border-line mb-9 border-b pb-8">
        <div className="text-ink-subtle mb-5 flex items-center gap-3 text-xs">
          <span className="bg-brand-soft text-brand rounded-control px-2.5 py-1 font-semibold">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden />약 {article.minutes}분
          </span>
        </div>
        <h1 className="text-ink text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          {article.title}
        </h1>
        <p className="text-ink-muted mt-5 text-base leading-8">
          {article.description}
        </p>
      </header>
      <div className="space-y-12">
        {article.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2
              id={section.id}
              className="text-ink mb-4 scroll-mt-28 text-xl font-semibold tracking-tight"
            >
              <a
                href={`#${section.id}`}
                className="hover:text-brand focus-visible:outline-brand"
              >
                {section.title}
              </a>
            </h2>
            {section.blocks.map((block, i) => {
              switch (block.type) {
                case "paragraph":
                  return (
                    <p
                      key={i}
                      className="text-ink-muted my-4 text-[15px] leading-8"
                    >
                      {block.text}
                    </p>
                  );
                case "list":
                  return (
                    <ul
                      key={i}
                      className="text-ink-muted marker:text-brand my-5 list-disc space-y-3 pl-5 text-[15px] leading-7"
                    >
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                case "code":
                  return (
                    <CodeBlock
                      key={`${article.slug}-${i}`}
                      code={block.code}
                      language={block.language}
                    />
                  );
                case "note":
                  return (
                    <aside
                      key={i}
                      className="bg-brand-soft border-brand/20 rounded-panel my-6 flex gap-3 border p-5"
                    >
                      <Info
                        aria-hidden
                        className="text-brand mt-0.5 size-4 shrink-0"
                      />
                      <div>
                        <p className="text-ink text-sm font-semibold">
                          {block.title}
                        </p>
                        <p className="text-ink-muted mt-2 text-sm leading-7">
                          {block.text}
                        </p>
                      </div>
                    </aside>
                  );
              }
            })}
          </section>
        ))}
      </div>
      <nav
        aria-label="이전 및 다음 문서"
        className="border-line mt-14 grid gap-4 border-t pt-7 sm:grid-cols-2"
      >
        {previous ? (
          <Link
            to="/docs/$slug"
            params={{ slug: previous.slug }}
            className="border-line hover:border-brand rounded-panel border p-4"
          >
            <span className="text-ink-subtle mb-2 flex items-center gap-2 text-xs">
              <ArrowLeft className="size-3" aria-hidden />
              이전 문서
            </span>
            <span className="text-ink text-sm font-semibold">
              {previous.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            to="/docs/$slug"
            params={{ slug: next.slug }}
            className="border-line hover:border-brand rounded-panel border p-4 text-right"
          >
            <span className="text-ink-subtle mb-2 flex items-center justify-end gap-2 text-xs">
              다음 문서
              <ArrowRight className="size-3" aria-hidden />
            </span>
            <span className="text-ink text-sm font-semibold">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
