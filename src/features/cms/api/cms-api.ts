import { postSchema } from "@/features/cms/model/cms-schema";
import type { PostInput } from "@/features/cms/model/cms-schema";
import { apiRequest } from "@/shared/api/http-client";

export const getPosts = () =>
  apiRequest("/api/cms/posts", { schema: postSchema.array() });

export const getPost = (id: string) =>
  apiRequest(`/api/cms/posts/${encodeURIComponent(id)}`, {
    schema: postSchema,
  });

export function savePost(id: string | null, input: PostInput) {
  return apiRequest(
    id ? `/api/cms/posts/${encodeURIComponent(id)}` : "/api/cms/posts",
    {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      schema: postSchema,
    },
  );
}
