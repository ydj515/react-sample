import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  userProfileSchema,
  membershipGrades,
  type ManagedUser,
  type UserProfile,
} from "@/features/users/model/user-schema";
import { useUpdateUserProfileMutation } from "@/features/users/queries/user-queries";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { toast } from "@/stores/toast-store";

export function UserProfileForm({ user }: { user: ManagedUser }) {
  const form = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userProfileSchema.parse(user),
  });
  const mutation = useUpdateUserProfileMutation(user.id, () => {
    form.reset(form.getValues());
    toast.success("회원 정보를 저장했습니다.");
  });
  return (
    <Card className="p-5 sm:p-6">
      <form
        id="user-profile-form"
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="grid gap-5"
      >
        <h2 className="font-semibold">회원 정보 편집</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              { name: "name", label: "이름" },
              { name: "nickname", label: "닉네임" },
              { name: "email", label: "이메일" },
              { name: "phone", label: "연락처" },
              { name: "department", label: "소속 부서" },
            ] as const
          ).map((field) => (
            <div key={field.name} className="grid gap-2">
              <label
                htmlFor={`user-${field.name}`}
                className="text-ink-subtle text-xs font-medium"
              >
                {field.label}
              </label>
              <Input
                id={`user-${field.name}`}
                {...form.register(field.name)}
                aria-invalid={!!form.formState.errors[field.name]}
              />
              {form.formState.errors[field.name] ? (
                <p role="alert" className="text-negative text-xs">
                  {form.formState.errors[field.name]?.message}
                </p>
              ) : null}
            </div>
          ))}
          <label className="text-ink-subtle grid gap-2 text-xs">
            회원 등급
            <Select {...form.register("grade")}>
              {membershipGrades.map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </Select>
          </label>
          <label className="text-ink-subtle grid gap-2 text-xs sm:col-span-2">
            주소
            <Input {...form.register("address")} maxLength={200} />
          </label>
          <label className="text-ink-subtle grid gap-2 text-xs sm:col-span-2">
            관리자 메모
            <Textarea {...form.register("memo")} maxLength={1000} />
          </label>
        </div>
        {mutation.error ? (
          <p role="alert" className="text-negative text-sm">
            {mutation.error.message}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button disabled={mutation.isPending || !form.formState.isDirty}>
            {mutation.isPending ? "저장 중…" : "회원 정보 저장"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
