import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/server";
import { getPosts, getPost, savePost } from "./cms-api";

const input = {
  title: "새 글",
  category: "개발",
  tags: ["React"],
  markdown: "# 본문\n새 콘텐츠",
  status: "draft" as const,
};

describe("CMS API", () => {
  it("creates, loads and publishes a draft", async () => {
    const post = await savePost(null, input);
    expect(await getPost(post.id)).toMatchObject(input);
    await savePost(post.id, { ...input, status: "published" });
    expect((await getPosts()).find((item) => item.id === post.id)?.status).toBe(
      "published",
    );
  });
  it("rejects missing posts and invalid writes", async () => {
    await expect(getPost("missing")).rejects.toMatchObject({ status: 404 });
    await expect(savePost("missing", input)).rejects.toMatchObject({
      status: 404,
    });
    await expect(savePost(null, { ...input, title: "" })).rejects.toMatchObject(
      { status: 400 },
    );
  });
  it("rejects invalid response schemas", async () => {
    server.use(http.get("/api/cms/posts", () => HttpResponse.json([{}])));
    await expect(getPosts()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });
});
