import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { usersQueryOptions } from "@/features/users/queries/user-queries";
import {
  usersSearchSchema,
  userRoles,
  userStatuses,
  roleLabels,
  userStatusLabels,
} from "@/features/users/model/user-schema";
import { selectUsers } from "@/features/users/model/user-utils";
import { UserStatusBadge } from "@/features/users/components/UserStatusBadge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { CollectionTable } from "@/shared/ui/collection-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { SearchInput } from "@/shared/ui/search-input";
import { FilterBar, FilterField } from "@/shared/ui/filter-bar";
import { PageHeader } from "@/shared/ui/page-header";
import { Pagination } from "@/shared/ui/pagination";
import { QueryFeedback } from "@/shared/ui/query-feedback";
import { Select } from "@/shared/ui/select";

export function UsersPage() {
  const search = usersSearchSchema.parse(useSearch({ strict: false }));
  const navigate = useNavigate();
  const query = useQuery(usersQueryOptions());
  const users = query.data ?? [];
  const result = selectUsers(users, search);
  const change = (patch: Partial<typeof search>) =>
    void navigate({
      to: "/users",
      search: { ...search, page: 1, ...patch },
      replace: true,
    });
  return (
    <section className="grid min-w-0 gap-6">
      <PageHeader
        title="사용자 관리"
        description="워크스페이스 구성원의 역할과 이용 상태를 관리하세요."
        actions={
          <Button
            variant="secondary"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            새로고침
          </Button>
        }
      />
      <div className="grid grid-cols-3 gap-3">
        {[
          ["전체 사용자", users.length],
          [
            "활성 사용자",
            users.filter((user) => user.status === "active").length,
          ],
          [
            "초대 대기",
            users.filter((user) => user.status === "invited").length,
          ],
        ].map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-ink-subtle text-xs">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          </Card>
        ))}
      </div>
      <FilterBar>
        <FilterField label="사용자 검색" grow>
          <SearchInput
            value={search.q}
            placeholder="이름, 이메일, 부서 검색"
            onChange={(event) => change({ q: event.target.value })}
          />
        </FilterField>
        <FilterField label="역할">
          <Select
            value={search.role}
            onChange={(event) =>
              change({ role: event.target.value as typeof search.role })
            }
          >
            <option value="all">전체 역할</option>
            {userRoles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="이용 상태">
          <Select
            value={search.status}
            onChange={(event) =>
              change({ status: event.target.value as typeof search.status })
            }
          >
            <option value="all">전체 상태</option>
            {userStatuses.map((status) => (
              <option key={status} value={status}>
                {userStatusLabels[status]}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="사용자 정렬">
          <Select
            value={search.sort}
            onChange={(event) =>
              change({ sort: event.target.value as typeof search.sort })
            }
          >
            <option value="newest">최근 가입순</option>
            <option value="oldest">가입일순</option>
            <option value="name">이름순</option>
          </Select>
        </FilterField>
        <Button
          type="button"
          variant="secondary"
          onClick={() => change(usersSearchSchema.parse({}))}
        >
          초기화
        </Button>
      </FilterBar>
      <QueryFeedback
        pending={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
      />
      {query.data ? (
        result.total ? (
          <>
            <CollectionTable label="사용자 목록">
              <thead>
                <tr>
                  {[
                    "사용자",
                    "부서",
                    "역할",
                    "상태",
                    "최근 접속",
                    "가입일",
                  ].map((text) => (
                    <th scope="col" key={text}>
                      {text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.items.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span
                          className="bg-brand-soft text-brand grid size-9 shrink-0 place-items-center rounded-full font-semibold"
                          aria-hidden
                        >
                          {user.name.slice(-2)}
                        </span>
                        <div>
                          <Link
                            to="/users/$userId"
                            params={{ userId: user.id }}
                            search={{ ...search, tab: "profile" }}
                            className="text-brand font-semibold hover:underline"
                          >
                            {user.name}
                          </Link>
                          <p className="text-ink-subtle mt-1 text-xs">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{user.department}</td>
                    <td className="whitespace-nowrap">
                      {roleLabels[user.role]}
                    </td>
                    <td>
                      <UserStatusBadge status={user.status} />
                    </td>
                    <td className="text-ink-subtle whitespace-nowrap">
                      {user.lastSeenAt?.slice(0, 10) ?? "접속 이력 없음"}
                    </td>
                    <td className="text-ink-subtle whitespace-nowrap">
                      {user.joinedAt.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </CollectionTable>
            <Pagination {...result} onChange={(page) => change({ page })} />
          </>
        ) : (
          <>
            <EmptyState
              title="조건에 맞는 사용자가 없습니다."
              onReset={() => change(usersSearchSchema.parse({}))}
            />
            <Pagination {...result} onChange={(page) => change({ page })} />
          </>
        )
      ) : null}
    </section>
  );
}
