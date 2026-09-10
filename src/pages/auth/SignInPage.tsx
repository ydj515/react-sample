import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useActionState } from "react";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";

import { signInRequest } from "@/features/auth/api";
import { AuthLayout } from "@/layouts/AuthLayout";
import { SubmitButton } from "@/shared/ui/submit-button";
import { PageMetadata } from "@/shared/ui/page-metadata";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useAuthStore } from "@/stores/auth-store";

const signInSchema = z.object({
  email: z.email("올바른 이메일을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

type SignInValues = z.infer<typeof signInSchema>;

const defaultValues: SignInValues = {
  email: "",
  password: "",
};

export function SignInPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/signin" });
  const signIn = useAuthStore((state) => state.signIn);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues,
  });
  const errors = form.formState.errors;

  const email = useController({ name: "email", control: form.control });
  const password = useController({ name: "password", control: form.control });
  const [result, submitAction, pending] = useActionState<
    { error: string | null },
    FormData
  >(
    async () => {
      if (!(await form.trigger(undefined, { shouldFocus: true })))
        return { error: null };
      try {
        const { token, user } = await signInRequest(form.getValues());
        signIn({ token, user });
        await navigate({ to: search.redirect ?? "/" });
        return { error: null };
      } catch {
        return { error: "로그인에 실패했습니다. 다시 시도해주세요." };
      }
    },
    { error: null },
  );

  return (
    <AuthLayout>
      <PageMetadata title="로그인" />
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="text-ink-subtle mt-1 text-sm">
          데모 인증입니다. 아무 이메일과 비밀번호로 로그인할 수 있습니다.
        </p>
        <form className="mt-6 grid gap-4" action={submitAction} noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...email.field}
              disabled={pending}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? true : undefined}
            />
            {errors.email ? (
              <p
                id="email-error"
                className="text-negative text-sm"
                role="alert"
              >
                {errors.email.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...password.field}
              disabled={pending}
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={errors.password ? true : undefined}
            />
            {errors.password ? (
              <p
                id="password-error"
                className="text-negative text-sm"
                role="alert"
              >
                {errors.password.message}
              </p>
            ) : null}
          </div>
          {result.error ? (
            <p className="text-negative text-sm" role="alert">
              {result.error}
            </p>
          ) : null}
          <SubmitButton pendingLabel="로그인 중…">로그인</SubmitButton>
        </form>
      </Card>
    </AuthLayout>
  );
}
