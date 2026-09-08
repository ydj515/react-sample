import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  userAccessSchema,
  permissionLabels,
  userRoles,
  userStatuses,
  roleLabels,
  userStatusLabels,
  type ManagedUser,
  type UserAccess,
} from "../model/user-schema";
import { useUpdateUserAccessMutation } from "../queries/user-queries";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { toast } from "@/stores/toast-store";

export function UserAccessForm({ user }: { user: ManagedUser }) {
  const form = useForm<UserAccess>({
    resolver: zodResolver(userAccessSchema),
    defaultValues: {
      role: user.role,
      status: user.status,
      permissions: user.permissions,
    },
  });
  const mutation = useUpdateUserAccessMutation(user.id, () => {
    form.reset(form.getValues());
    toast.success("사용자 권한과 상태를 저장했습니다.");
  });
  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      <div>
        <h2 className="font-semibold">역할 및 이용 상태</h2>
        <p className="text-ink-subtle mt-2 text-sm">
          변경 사항은 저장 후 사용자 목록과 활동 이력에 반영됩니다.
        </p>
      </div>
      <label className="grid gap-2 text-sm">
        사용자 역할
        <Select {...form.register("role")}>
          {userRoles.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </Select>
      </label>
      <p className="text-ink-subtle text-sm">
        관리자: 전체 운영 · 매니저: 업무 관리 · 조회 전용: 현황 확인
      </p>
      <label className="grid gap-2 text-sm">
        사용자 상태
        <Select {...form.register("status")}>
          {userStatuses.map((status) => (
            <option key={status} value={status}>
              {userStatusLabels[status]}
            </option>
          ))}
        </Select>
      </label>
      <div className="grid gap-3">
        {Object.entries(permissionLabels).map(([key, [label, description]]) => (
          <label
            key={key}
            className="rounded-control border-line bg-surface-muted flex items-center justify-between gap-4 border p-4"
          >
            <span>
              <span className="block text-sm font-medium">{label}</span>
              <span className="text-ink-subtle mt-1 block text-xs">
                {description}
              </span>
            </span>
            <span className="relative shrink-0">
              <input
                type="checkbox"
                role="switch"
                aria-label={label}
                className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer opacity-0"
                {...form.register(
                  `permissions.${key as keyof typeof permissionLabels}`,
                )}
              />
              <span
                aria-hidden
                className="bg-line-strong peer-checked:bg-brand peer-focus-visible:outline-brand block h-6 w-11 rounded-full transition peer-focus-visible:outline-2 after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5"
              />
            </span>
          </label>
        ))}
      </div>
      {mutation.error ? (
        <p role="alert" className="text-negative text-sm">
          {mutation.error.message}
        </p>
      ) : null}
      <div>
        <Button
          type="submit"
          disabled={mutation.isPending || !form.formState.isDirty}
        >
          {mutation.isPending ? "저장 중…" : "변경 사항 저장"}
        </Button>
      </div>
    </form>
  );
}
