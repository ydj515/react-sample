import { useUrlSearch } from "@/shared/lib/use-url-search";
import { docsSearchSchema } from "@/features/docs/model/search";
import { Link } from "@tanstack/react-router";
import { SearchInput } from "@/shared/ui/search-input";
import { Button } from "@/shared/ui/button";
import { searchDocuments } from "@/features/docs/model/documents";

export function DocsSearch() {
  const [search, change] = useUrlSearch(docsSearchSchema);
  const query = search.q;
  const setQuery = (value: typeof query) => change({ q: value }, true);
  const results = searchDocuments(query);
  return (
    <div
      className="relative w-full max-w-md"
      onKeyDown={(event) => {
        if (event.key === "Escape") setQuery("");
      }}
    >
      <SearchInput
        type="search"
        aria-label="문서 검색"
        placeholder="문서 검색…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query.trim() && (
        <div className="bg-surface border-line rounded-panel absolute top-12 right-0 left-0 z-30 max-h-[65vh] overflow-y-auto border p-2 shadow-xl">
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <p role="status" className="text-ink-subtle text-xs">
              검색 결과 {results.length}개
            </p>
            <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
              닫기
            </Button>
          </div>
          {results.length ? (
            <ul aria-label="문서 검색 결과">
              {results.map((result) => (
                <li key={result.slug}>
                  <Link
                    to="/docs/$slug"
                    params={{ slug: result.slug }}
                    hash={result.hash}
                    search={{ q: "" }}
                    className="hover:bg-brand-soft focus-visible:outline-brand rounded-control block p-3"
                  >
                    <span className="text-ink block text-sm font-semibold">
                      {result.title}
                    </span>
                    <span className="text-ink-subtle mt-1 block text-xs leading-5">
                      {result.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-muted p-3 text-sm">
              일치하는 문서가 없습니다. 다른 검색어를 입력하세요.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
