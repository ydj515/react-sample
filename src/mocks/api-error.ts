import { HttpResponse } from "msw";

type MockApiErrorOptions = {
  status: number;
  code: string;
  message: string;
  path: string;
};

export function createMockApiError({
  status,
  code,
  message,
  path,
}: MockApiErrorOptions) {
  const traceId = `mock-trace-${crypto.randomUUID()}`;

  return HttpResponse.json(
    {
      status,
      code,
      message,
      path,
      traceId,
    },
    {
      status,
      headers: { "X-Trace-Id": traceId },
    },
  );
}
