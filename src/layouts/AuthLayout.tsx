import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      {children ?? <Outlet />}
    </main>
  );
}
