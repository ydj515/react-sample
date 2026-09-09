import { z } from "zod";

export const docsSearchSchema = z.object({ q: z.string().catch("") });
