import { setupServer } from "msw/node";

import { handlers, resetProjectsMockData } from "./handlers";

export const server = setupServer(...handlers);

export { resetProjectsMockData };

export { resetManagementMockData } from "@/mocks/data/management";
