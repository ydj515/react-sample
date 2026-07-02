import { createFileRoute } from "@tanstack/react-router";

import { SignInPage } from "@/pages/auth/SignInPage";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});
