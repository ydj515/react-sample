import { useParams, useNavigate, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postInputSchema } from "@/features/cms/model/cms-schema";
import type { Post } from "@/features/cms/model/cms-schema";
import { postOptions, useSavePost } from "@/features/cms/queries/cms-queries";
import { Markdown } from "@/features/cms/components/Markdown";
import { PageHeader } from "@/shared/ui/page-header";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Select } from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { QueryBoundary } from "@/shared/ui/query-boundary";

const editorSchema = postInputSchema.omit({ tags: true }).extend({
  tagsText: z.string().refine(
    (text) =>
      postInputSchema.shape.tags.safeParse(
        text
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ).success,
    "태그는 각 30자, 최대 10개까지 입력하세요.",
  ),
});

type EditorValues = z.infer<typeof editorSchema>;

export function PostEditor({ post }: { post?: Post }) {
  const form = useForm<EditorValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      title: post?.title ?? "",
      category: post?.category ?? "개발",
      tagsText: post?.tags.join(", ") ?? "",
      markdown: post?.markdown ?? "",
      status: post?.status ?? "draft",
    },
  });

  const markdown = useWatch({ control: form.control, name: "markdown" });

  const save = useSavePost(post?.id ?? null);

  const navigate = useNavigate();

  function submit(values: EditorValues) {
    save.mutate(
      {
        ...values,
        tags: [
          ...new Set(
            values.tagsText
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          ),
        ],
      },
      {
        onSuccess: (result) => {
          void navigate({ to: "/cms/$postId", params: { postId: result.id } });
        },
      },
    );
  }
  return (
    <section className="grid gap-6">
      <PageHeader
        title={post ? "글 수정" : "새 글 작성"}
        description="마크다운을 입력하고 미리보기를 확인한 뒤 저장하세요."
        actions={
          <Link
            to="/cms"
            search={{ q: "", category: "", tag: "", status: "all" }}
            className="text-brand underline"
          >
            글 목록
          </Link>
        }
      />
      <form
        noValidate
        onSubmit={(event) => {
          void form.handleSubmit(submit)(event);
        }}
        className="grid gap-5"
      >
        <fieldset disabled={save.isPending} className="grid min-w-0 gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["title", "제목"],
                ["category", "카테고리"],
                ["tagsText", "태그 (쉼표 구분)"],
              ] as const
            ).map(([name, label]) => (
              <label key={name} className="grid gap-2 text-sm">
                {label}
                <Input
                  {...form.register(name)}
                  aria-label={label}
                  aria-invalid={!!form.formState.errors[name]}
                  aria-describedby={
                    form.formState.errors[name] ? `${name}-error` : undefined
                  }
                />
                {form.formState.errors[name] && (
                  <span
                    id={`${name}-error`}
                    role="alert"
                    className="text-negative"
                  >
                    {form.formState.errors[name]?.message}
                  </span>
                )}
              </label>
            ))}
            <label className="grid gap-2 text-sm">
              게시 상태
              <Select {...form.register("status")}>
                <option value="draft">초안</option>
                <option value="published">게시됨</option>
              </Select>
            </label>
          </div>
          <div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm">
              마크다운 본문
              <Textarea
                rows={18}
                {...form.register("markdown")}
                aria-label="마크다운 본문"
                aria-invalid={!!form.formState.errors.markdown}
                aria-describedby={
                  form.formState.errors.markdown ? "markdown-error" : undefined
                }
              />
              {form.formState.errors.markdown && (
                <span
                  id="markdown-error"
                  role="alert"
                  className="text-negative"
                >
                  {form.formState.errors.markdown.message}
                </span>
              )}
            </label>
            <Card className="min-w-0 p-5">
              <h2 className="mb-4 font-semibold">미리보기</h2>
              <Markdown source={markdown} />
            </Card>
          </div>
          <Button
            type="submit"
            className="justify-self-start"
            disabled={save.isPending}
          >
            {save.isPending ? "저장 중…" : "글 저장"}
          </Button>
        </fieldset>
        {save.error && (
          <p role="alert" className="text-negative text-sm">
            {save.error.message} 입력 내용은 유지됩니다.
          </p>
        )}
      </form>
    </section>
  );
}

function ExistingEditor({ id }: { id: string }) {
  const { data } = useSuspenseQuery(postOptions(id));
  return <PostEditor key={id} post={data} />;
}

export function CmsEditorPage() {
  const { postId } = useParams({ strict: false });
  return (
    <QueryBoundary>
      {postId ? <ExistingEditor id={postId} /> : <PostEditor />}
    </QueryBoundary>
  );
}
