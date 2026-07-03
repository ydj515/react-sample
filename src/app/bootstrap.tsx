import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/App";

type BootstrapOptions = {
  container?: HTMLElement | null;
  enableMocking?: () => Promise<void>;
  onMockingError?: (error: unknown) => void;
  render?: (container: HTMLElement) => void;
};

export async function enableMocking() {
  const { worker } = await import("@/mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

export function renderApp(container: HTMLElement) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export function bootstrapApp({
  container = document.getElementById("root"),
  enableMocking: startMocking = enableMocking,
  onMockingError = (error) => {
    console.error("Failed to start mock service worker", error);
  },
  render = renderApp,
}: BootstrapOptions = {}) {
  if (!container) {
    throw new Error("Root element not found");
  }

  void startMocking()
    .catch((error: unknown) => {
      onMockingError(error);
    })
    .finally(() => {
      render(container);
    });
}
