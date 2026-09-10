import { PageMetadata } from "@/shared/ui/page-metadata";
import { Link } from "@tanstack/react-router";
import { BookOpen, Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/layouts/ThemeToggle";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/ui/dialog";
import { ReadingProgress } from "@/features/docs/components/ReadingProgress";
import { DocsArticle } from "@/features/docs/components/DocsArticle";
import { DocsSearch } from "@/features/docs/components/DocsSearch";
import { DocsNavigation } from "@/features/docs/components/DocsNavigation";
import { DocsToc } from "@/features/docs/components/DocsToc";
import { findDocument } from "@/features/docs/model/documents";

export function DocsPage({ slug }: { slug: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const article = findDocument(slug);
  return (
    <div className="bg-surface text-ink min-h-screen">
      <PageMetadata
        title={article?.title ?? "문서를 찾을 수 없습니다"}
        site="React Sample Docs"
        description={article?.description}
      />
      <a
        href="#doc-main"
        className="bg-brand text-on-brand sr-only top-2 left-2 z-[60] rounded focus:not-sr-only focus:fixed focus:px-4 focus:py-2"
      >
        본문으로 건너뛰기
      </a>
      <header className="bg-surface/95 border-line sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-[1440px] items-center gap-3 px-4 lg:gap-8 lg:px-8">
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="문서 메뉴 열기"
                className="shrink-0 lg:hidden"
              >
                <Menu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="top-0 left-0 h-dvh w-[min(20rem,85vw)] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none p-5">
              <div className="mb-8 flex items-center justify-between gap-3">
                <div>
                  <DialogTitle className="font-semibold">문서 메뉴</DialogTitle>
                  <DialogDescription className="text-ink-subtle mt-1 text-xs">
                    주제를 선택해 문서를 읽어보세요.
                  </DialogDescription>
                </div>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="문서 메뉴 닫기"
                  >
                    <X className="size-5" />
                  </Button>
                </DialogClose>
              </div>
              <DocsNavigation
                slug={slug}
                onNavigate={() => setMenuOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Link
            to="/docs/$slug"
            params={{ slug: "getting-started" }}
            aria-label="React Sample 문서 홈"
            className="focus-visible:outline-brand flex shrink-0 items-center gap-2 lg:w-56"
          >
            <span className="bg-brand text-on-brand rounded-control grid size-9 place-items-center">
              <BookOpen aria-hidden className="size-5" />
            </span>
            <span className="hidden text-sm font-semibold sm:block">
              React Sample
              <span className="text-ink-subtle ml-2 font-normal">Docs</span>
            </span>
          </Link>
          <div className="min-w-0 flex-1">
            <DocsSearch key={slug} />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-ink-muted hover:text-brand hidden items-center gap-1 text-sm lg:flex"
            >
              관리자 샘플
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
        {article && <ReadingProgress key={slug} />}
      </header>
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_210px]">
        <aside className="border-line sticky top-18 hidden h-[calc(100dvh-4.5rem)] flex-col border-r px-5 py-9 lg:flex">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DocsNavigation slug={slug} />
          </div>
          <p className="text-ink-subtle border-line mt-8 border-t px-3 pt-5 text-xs leading-6">
            React Sample 가이드
            <br />
            실행하며 배우는 UI 패턴
          </p>
        </aside>
        <main
          id="doc-main"
          tabIndex={-1}
          className="mx-auto w-full max-w-[820px] min-w-0 px-5 py-8 outline-none sm:px-10 lg:py-10"
        >
          {article ? (
            <>
              <div className="text-ink-subtle mb-7 flex items-center gap-2 text-xs">
                <Link
                  to="/docs/$slug"
                  params={{ slug: "getting-started" }}
                  className="hover:text-brand"
                >
                  문서
                </Link>
                <span aria-hidden>/</span>
                <span>{article.category}</span>
              </div>
              <details
                key={`toc-${slug}`}
                className="border-line bg-surface-muted rounded-control mb-7 border px-4 py-3 xl:hidden"
              >
                <summary className="focus-visible:outline-brand cursor-pointer text-sm font-medium">
                  이 페이지의 목차
                </summary>
                <div className="pt-4">
                  <DocsToc key={slug} sections={article.sections} />
                </div>
              </details>
              <DocsArticle key={slug} article={article} />
            </>
          ) : (
            <div className="py-20">
              <p className="text-brand mb-3 text-sm font-semibold">
                404 · DOCUMENT NOT FOUND
              </p>
              <h1 className="text-2xl font-bold">문서를 찾을 수 없습니다</h1>
              <p className="text-ink-muted my-5 leading-7">
                주소를 확인하거나 검색으로 필요한 문서를 찾아보세요.
              </p>
              <Button asChild>
                <Link to="/docs/$slug" params={{ slug: "getting-started" }}>
                  시작 문서로 이동
                </Link>
              </Button>
            </div>
          )}
          <footer className="border-line text-ink-subtle mt-12 flex flex-wrap items-center justify-between gap-3 border-t py-6 text-xs">
            <span>React Sample · 문서 예제</span>
            <Link to="/" className="hover:text-brand">
              관리자 샘플로 이동 →
            </Link>
          </footer>
        </main>
        {article && (
          <aside className="sticky top-18 hidden h-fit max-h-[calc(100dvh-4.5rem)] overflow-y-auto px-4 py-10 xl:block">
            <DocsToc key={slug} sections={article.sections} />
          </aside>
        )}
      </div>
    </div>
  );
}
