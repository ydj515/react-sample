import { z } from "zod";

import { apiRequest } from "@/shared/api/http-client";

export type SignInInput = {
  email: string;
  password: string;
};

export const signInResponseSchema = z.object({
  token: z.string().min(1),
  user: z.object({
    email: z.email(),
  }),
});

export type SignInResponse = z.infer<typeof signInResponseSchema>;

export async function signInRequest(
  input: SignInInput,
): Promise<SignInResponse> {
  return apiRequest("/api/login", {
    schema: signInResponseSchema,
    fallbackErrorMessage: "로그인에 실패했습니다.",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}
