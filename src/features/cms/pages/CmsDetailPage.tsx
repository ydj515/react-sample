import { Link, useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postOptions } from "@/features/cms/queries/cms-queries";
import { Markdown } from "@/features/cms/components/Markdown";
import { PageHeader } from "@/shared/ui/page-header";
import { Card } from "@/shared/ui/card";
import { QueryBoundary } from "@/shared/ui/query-boundary";

function DetailContent() {
  const { postId } = useParams({ strict: false });

  const { data: post } = useSuspenseQuery(postOptions(postId!));
  return (
    <section className="grid gap-6">
      <PageHeader
        title={post.title}
        description={`${post.category} · ${post.status === "draft" ? "초안" : "게시됨"} · ${post.tags.join(", ")}`}
        actions={
          <>
            <Link
              to="/cms"
              search={{ q: "", category: "", tag: "", status: "all" }}
              className="text-brand underline"
            >
              글 목록
            </Link>
            <Link
              to="/cms/$postId/edit"
              params={{ postId: post.id }}
              className="text-brand underline"
            >
              글 수정
            </Link>
          </>
        }
      />
      <Card className="p-5 md:p-8">
        <Markdown source={post.markdown} />
      </Card>
    </section>
  );
}

export function CmsDetailPage() {
  return (
    <QueryBoundary>
      <DetailContent />
    </QueryBoundary>
  );
}
