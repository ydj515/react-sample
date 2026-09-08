import { z } from "zod";

export const listSearchSchema = z.object({
  q: z.string().catch(""),
  sort: z.enum(["newest", "oldest", "name"]).catch("newest"),
  page: z.coerce.number().int().min(1).max(10000).catch(1),
});
export function paginate<T>(items: T[], requestedPage: number, pageSize = 8) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), pages);
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pages,
    total: items.length,
    pageSize,
  };
}
export function matchesSearch(query: string, ...values: string[]) {
  return values
    .join(" ")
    .toLocaleLowerCase("ko-KR")
    .includes(query.trim().toLocaleLowerCase("ko-KR"));
}
