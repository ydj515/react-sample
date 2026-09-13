import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getPosts, getPost, savePost } from "@/features/cms/api/cms-api";
import type { PostInput } from "@/features/cms/model/cms-schema";

export const postsOptions = () =>
  queryOptions({ queryKey: ["cms", "posts"], queryFn: getPosts });

export const postOptions = (id: string) =>
  queryOptions({ queryKey: ["cms", "post", id], queryFn: () => getPost(id) });

export function useSavePost(id: string | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: PostInput) => savePost(id, input),
    onSuccess: async (post) => {
      client.setQueryData(postOptions(post.id).queryKey, post);
      await client.invalidateQueries({ queryKey: ["cms"] });
    },
  });
}
