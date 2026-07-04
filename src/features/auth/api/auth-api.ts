import type { AuthUser } from "@/stores/auth-store";

export type SignInInput = {
  email: string;
  password: string;
};

export type SignInResponse = {
  token: string;
  user: AuthUser;
};

export async function signInRequest(
  input: SignInInput,
): Promise<SignInResponse> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(error?.message ?? "로그인에 실패했습니다.");
  }

  return response.json() as Promise<SignInResponse>;
}
