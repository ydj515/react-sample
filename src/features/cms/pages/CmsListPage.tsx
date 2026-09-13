import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsOptions } from "@/features/cms/queries/cms-queries";
import { cmsSearchSchema, filterPosts } from "@/features/cms/model/cms-schema";
import { PageHeader } from "@/shared/ui/page-header";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { EmptyState } from "@/shared/ui/empty-state";
import { QueryBoundary } from "@/shared/ui/query-boundary";

function CmsListContent() {
  const { data: posts } = useSuspenseQuery(postsOptions());

  const search = cmsSearchSchema.parse(useSearch({ strict: false }));

  const navigate = useNavigate();

  const update = (patch: Partial<typeof search>) => {
    void navigate({
      to: "/cms",
      search: { ...search, ...patch },
      replace: true,
    });
  };

  const filtered = filterPosts(posts, search);
  return (
    <section className="grid gap-6">
      <PageHeader
        title="블로그 / CMS"
        description="글을 작성하고 분류하며 초안에서 게시까지 관리하세요."
        actions={
          <Link to="/cms/new" className="text-brand font-medium underline">
            새 글 작성
          </Link>
        }
      />
      <Card className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-2 text-sm">
          글 검색
          <Input
            value={search.q}
            onChange={(event) => update({ q: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm">
          카테고리
          <Select
            value={search.category}
            onChange={(event) => update({ category: event.target.value })}
          >
            <option value="">전체 카테고리</option>
            {[...new Set(posts.map((post) => post.category))].map(
              (category) => (
                <option key={category}>{category}</option>
              ),
            )}
          </Select>
        </label>
        <label className="grid gap-2 text-sm">
          태그
          <Select
            value={search.tag}
            onChange={(event) => update({ tag: event.target.value })}
          >
            <option value="">전체 태그</option>
            {[...new Set(posts.flatMap((post) => post.tags))].map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </Select>
        </label>
        <label className="grid gap-2 text-sm">
          게시 상태
          <Select
            value={search.status}
            onChange={(event) =>
              update({
                status: cmsSearchSchema.parse({ status: event.target.value })
                  .status,
              })
            }
          >
            <option value="all">전체 상태</option>
            <option value="draft">초안</option>
            <option value="published">게시됨</option>
          </Select>
        </label>
      </Card>
      <p className="text-ink-subtle text-sm" role="status">
        {filtered.length}개의 글
      </p>
      {!filtered.length && (
        <EmptyState
          title="조건에 맞는 글이 없습니다."
          onReset={() => update(cmsSearchSchema.parse({}))}
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <Card key={post.id} className="min-w-0 space-y-3 p-5">
            <p className="text-ink-subtle text-xs">
              {post.category} · {post.status === "draft" ? "초안" : "게시됨"}
            </p>
            <h2 className="text-lg font-semibold break-words">
              <Link
                to="/cms/$postId"
                params={{ postId: post.id }}
                className="hover:text-brand"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-ink-subtle line-clamp-2 text-sm break-words">
              {post.markdown.slice(0, 150)}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className="text-brand text-xs underline"
                  onClick={() => update({ tag })}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <p className="text-ink-subtle text-xs">
              수정일 {post.updatedAt.slice(0, 10)}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function CmsListPage() {
  return (
    <QueryBoundary>
      <CmsListContent />
    </QueryBoundary>
  );
}
