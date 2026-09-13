import { z } from "zod";

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력하세요.").max(120),
  category: z.string().trim().min(1, "카테고리를 입력하세요.").max(40),
  tags: z.array(z.string().trim().min(1).max(30)).max(10),
  markdown: z.string().trim().min(1, "본문을 입력하세요.").max(30000),
  status: z.enum(["draft", "published"]),
});

export const postSchema = postInputSchema.extend({
  id: z.string(),
  updatedAt: z.string(),
});

export type PostInput = z.infer<typeof postInputSchema>;

export type Post = z.infer<typeof postSchema>;

export const cmsSearchSchema = z.object({
  q: z.string().catch(""),
  category: z.string().catch(""),
  tag: z.string().catch(""),
  status: z.enum(["all", "draft", "published"]).catch("all"),
});

export function filterPosts(
  posts: Post[],
  search: z.infer<typeof cmsSearchSchema>,
) {
  const query = search.q.trim().toLocaleLowerCase();
  return posts.filter(
    (post) =>
      (!search.category || post.category === search.category) &&
      (!search.tag || post.tags.includes(search.tag)) &&
      (search.status === "all" || post.status === search.status) &&
      `${post.title} ${post.markdown} ${post.tags.join(" ")}`
        .toLocaleLowerCase()
        .includes(query),
  );
}
