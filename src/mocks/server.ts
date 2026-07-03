import { setupServer } from "msw/node";

import { handlers, resetProjectsMockData } from "@/mocks/handlers";

export const server = setupServer(...handlers);

export { resetProjectsMockData };
