import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SignInPage } from "@/pages/auth/SignInPage";

const signInSearchSchema = z.object({
  // 보호 라우트에서 넘어올 때 원래 목적지를 담는다.
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/signin")({
  validateSearch: signInSearchSchema,
  component: SignInPage,
});
