import { z } from "zod";
import { defaultOrderFilters, orderFiltersSchema } from "./commerce-utils";

export const commerceSearchSchema = z.object({
  orderFilters: orderFiltersSchema.catch(defaultOrderFilters),
  orderSort: z
    .enum(["newest", "oldest", "amount-desc", "amount-asc"])
    .catch("newest"),
  orderPage: z.coerce.number().int().min(1).max(10000).catch(1),
});
