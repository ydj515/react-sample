import { setupServer } from "msw/node";

import { handlers, resetProjectsMockData } from "./handlers";

export const server = setupServer(...handlers);

export { resetProjectsMockData };

export { resetManagementMockData } from "@/mocks/data/management";

export { resetNotificationsMockData } from "@/mocks/data/notifications";

export { resetKanbanMockData } from "@/mocks/data/kanban";
