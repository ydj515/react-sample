export type ApiErrorDetails = {
  status: number;
  code: string;
  path?: string;
  traceId?: string;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly path?: string;
  readonly traceId?: string;

  constructor(message: string, details: ApiErrorDetails) {
    super(message, { cause: details.cause });

    this.name = "ApiError";
    this.status = details.status;
    this.code = details.code;
    this.path = details.path;
    this.traceId = details.traceId;
  }
}
