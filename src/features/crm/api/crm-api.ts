import {
  crmSchema,
  contactSchema,
  dealSchema,
  activitySchema,
} from "@/features/crm/model/crm-schema";
import type {
  ContactInput,
  DealInput,
  DealStage,
} from "@/features/crm/model/crm-schema";
import { apiRequest } from "@/shared/api/http-client";

const json = (body: unknown) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const getCrm = () => apiRequest("/api/crm", { schema: crmSchema });

export const createContact = (input: ContactInput) =>
  apiRequest("/api/crm/contacts", { ...json(input), schema: contactSchema });

export const createDeal = (input: DealInput) =>
  apiRequest("/api/crm/deals", { ...json(input), schema: dealSchema });

export const moveDeal = (id: string, stage: DealStage) =>
  apiRequest(`/api/crm/deals/${encodeURIComponent(id)}/stage`, {
    ...json({ stage }),
    schema: dealSchema,
  });

export const addNote = (id: string, text: string) =>
  apiRequest(`/api/crm/contacts/${encodeURIComponent(id)}/notes`, {
    ...json({ text }),
    schema: activitySchema,
  });
