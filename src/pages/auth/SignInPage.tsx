import { AuthLayout } from "@/layouts/AuthLayout";

export function SignInPage() {
  return (
    <AuthLayout>
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold tracking-tight">로그인</h1>
        <p className="mt-2 text-sm text-slate-500">
          로그인 화면은 이후 task에서 완성합니다.
        </p>
      </section>
    </AuthLayout>
  );
}
