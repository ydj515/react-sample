import type { RootOptions } from "react-dom/client";

export type RenderErrorKind = "caught" | "uncaught" | "recoverable";
export function reportRenderError(
  kind: RenderErrorKind,
  error: unknown,
  componentStack?: string | null,
) {
  // Keep diagnostics local; do not include raw API errors, form values or tokens.
  console.error("React rendering error", {
    kind,
    name: error instanceof Error ? error.name : "UnknownError",
    componentStack: componentStack ?? "",
  });
}
export const rootErrorHandlers: RootOptions = {
  onCaughtError: (error, info) =>
    reportRenderError("caught", error, info.componentStack),
  onUncaughtError: (error, info) =>
    reportRenderError("uncaught", error, info.componentStack),
  onRecoverableError: (error, info) =>
    reportRenderError("recoverable", error, info.componentStack),
};
