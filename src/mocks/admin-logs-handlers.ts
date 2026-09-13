import { http, HttpResponse } from "msw";

import { adminLogSchema } from "@/features/admin-logs/model";
import { adminLogsFixture } from "@/mocks/data/admin-logs";

export const adminLogsHandlers = [
  http.get("/api/admin/logs", () =>
    HttpResponse.json(adminLogSchema.array().parse(adminLogsFixture)),
  ),
];
