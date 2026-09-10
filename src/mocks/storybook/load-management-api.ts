import { worker } from "@/mocks/browser";
import { resetManagementMockData } from "@/mocks/data/management";

let started: ReturnType<typeof worker.start> | undefined;
export async function loadManagementApi() {
  started ??= worker.start({ onUnhandledRequest: "bypass", quiet: true });
  await started;
  resetManagementMockData();
  return {};
}
