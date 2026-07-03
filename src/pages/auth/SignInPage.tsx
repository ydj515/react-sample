import { Link } from "@tanstack/react-router";

import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function SignInPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold">로그인</h1>
        <p className="mt-1 text-sm text-slate-500">
          인증 구현은 범위 밖이며 layout 예제만 제공합니다.
        </p>
        <form className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" autoComplete="email" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
            />
          </div>
          <Button type="button">로그인</Button>
        </form>
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-slate-600 hover:underline"
        >
          대시보드로 돌아가기
        </Link>
      </Card>
    </AuthLayout>
  );
}
