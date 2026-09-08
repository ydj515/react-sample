import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children?: ReactNode }) {
  return (
    <main className="bg-canvas flex min-h-screen items-center justify-center px-4">
      {children ?? <Outlet />}
    </main>
  );
}
