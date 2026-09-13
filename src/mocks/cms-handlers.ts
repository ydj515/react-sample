import { http, HttpResponse } from "msw";
import { postInputSchema } from "@/features/cms/model";
import type { Post } from "@/features/cms/model";
import { createMockApiError } from "./api-error";

const fixture: Post[] = [
  {
    id: "post-1",
    title: "React 상태 관리 가이드",
    category: "개발",
    tags: ["React", "상태 관리"],
    status: "published",
    updatedAt: "2026-09-01T09:00:00Z",
    markdown:
      "## 서버 상태와 화면 상태\n\n**TanStack Query**로 서버 데이터를 관리하고 `useState`로 화면 상태를 관리합니다.\n\n- 서버 데이터는 쿼리 캐시에 저장\n- 필터는 URL에 저장\n\n[문서 보기](/docs)\n\n```tsx\nconst [open, setOpen] = useState(false);\n```",
  },
  {
    id: "post-2",
    title: "디자인 시스템 작업 노트",
    category: "디자인",
    tags: ["접근성"],
    status: "draft",
    updatedAt: "2026-09-02T09:00:00Z",
    markdown:
      "## 접근성 체크리스트\n\n> 키보드만으로도 모든 작업을 완료할 수 있어야 합니다.\n\n1. 명확한 레이블\n2. 보이는 포커스\n3. 오류 복구",
  },
];

let posts = structuredClone(fixture);

export function resetCmsMockData() {
  posts = structuredClone(fixture);
}

function error(status: number, message: string, request: Request) {
  return createMockApiError({
    status,
    code: status === 404 ? "POST_NOT_FOUND" : "INVALID_POST",
    message,
    path: new URL(request.url).pathname,
  });
}

export const cmsHandlers = [
  http.get("/api/cms/posts", () => HttpResponse.json(posts)),
  http.get("/api/cms/posts/:id", ({ params, request }) => {
    const post = posts.find((item) => item.id === params.id);
    return post
      ? HttpResponse.json(post)
      : error(404, "글을 찾을 수 없습니다.", request);
  }),
  http.post("/api/cms/posts", async ({ request }) => {
    const parsed = postInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) return error(400, "글 입력을 확인하세요.", request);
    const post = {
      ...parsed.data,
      tags: [...new Set(parsed.data.tags)],
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(post);
    return HttpResponse.json(post, { status: 201 });
  }),
  http.put("/api/cms/posts/:id", async ({ params, request }) => {
    const index = posts.findIndex((item) => item.id === params.id);
    if (index < 0) return error(404, "글을 찾을 수 없습니다.", request);
    const parsed = postInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) return error(400, "글 입력을 확인하세요.", request);
    posts[index] = {
      ...parsed.data,
      tags: [...new Set(parsed.data.tags)],
      id: String(params.id),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(posts[index]);
  }),
];
