import { matchesSearch, paginate } from "@/shared/lib/list-search";
import { usersSearchSchema, type ManagedUser } from "./user-schema";
export function selectUsers(
  users: ManagedUser[],
  search: ReturnType<typeof usersSearchSchema.parse>,
) {
  return paginate(
    users
      .filter(
        (user) =>
          matchesSearch(search.q, user.name, user.email, user.department) &&
          (search.role === "all" || user.role === search.role) &&
          (search.status === "all" || user.status === search.status),
      )
      .sort((a, b) =>
        search.sort === "name"
          ? a.name.localeCompare(b.name, "ko")
          : search.sort === "oldest"
            ? a.joinedAt.localeCompare(b.joinedAt)
            : b.joinedAt.localeCompare(a.joinedAt),
      ),
    search.page,
  );
}
