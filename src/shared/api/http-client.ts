import { z } from "zod";

import { ApiError } from "@/shared/api/api-error";

const apiErrorResponseSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  path: z.string().optional(),
  traceId: z.string().optional(),
});

export type ApiRequestOptions<T> = RequestInit & {
  schema: z.ZodType<T>;
  fallbackErrorMessage?: string;
};

const invalidResponseMessage = "서버 응답 형식이 올바르지 않습니다.";
const networkErrorMessage = "서버에 연결하지 못했습니다.";

function getTraceId(response: Response, bodyTraceId?: string) {
  return bodyTraceId ?? response.headers.get("X-Trace-Id") ?? undefined;
}

function createInvalidResponseError(response: Response, cause: unknown) {
  return new ApiError(invalidResponseMessage, {
    status: response.status,
    code: "INVALID_RESPONSE",
    traceId: getTraceId(response),
    cause,
  });
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  options: ApiRequestOptions<T>,
): Promise<T> {
  const {
    schema,
    fallbackErrorMessage = "요청을 처리하지 못했습니다.",
    ...requestInit
  } = options;

  let response: Response;

  try {
    response = await fetch(input, requestInit);
  } catch (cause) {
    throw new ApiError(networkErrorMessage, {
      status: 0,
      code: "NETWORK_ERROR",
      cause,
    });
  }

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    const parsedError = apiErrorResponseSchema.safeParse(body);
    const error = parsedError.success ? parsedError.data : undefined;

    throw new ApiError(error?.message || fallbackErrorMessage, {
      status: response.status,
      code: error?.code ?? `HTTP_${response.status}`,
      path: error?.path,
      traceId: getTraceId(response, error?.traceId),
    });
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch (cause) {
    throw createInvalidResponseError(response, cause);
  }

  const parsedBody = schema.safeParse(body);

  if (!parsedBody.success) {
    throw createInvalidResponseError(response, parsedBody.error);
  }

  return parsedBody.data;
}
