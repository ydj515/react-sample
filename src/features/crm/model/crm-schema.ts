import { z } from "zod";

export const dealStages = [
  "lead",
  "qualified",
  "proposal",
  "won",
  "lost",
] as const;

export const stageLabels: Record<(typeof dealStages)[number], string> = {
  lead: "신규",
  qualified: "상담",
  proposal: "제안",
  won: "성사",
  lost: "종료",
};

export const contactInputSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력하세요.").max(80),
  email: z.email("이메일을 확인하세요."),
  companyId: z.string().min(1, "회사를 선택하세요."),
});

export const contactSchema = contactInputSchema.extend({ id: z.string() });

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string(),
});

export const dealInputSchema = z.object({
  title: z.string().trim().min(1, "딜 이름을 입력하세요.").max(120),
  contactId: z.string().min(1),
  amount: z.number().int().min(0).max(1000000000000),
});

export const dealSchema = dealInputSchema.extend({
  id: z.string(),
  stage: z.enum(dealStages),
});

export const noteInputSchema = z.object({
  text: z.string().trim().min(1, "메모를 입력하세요.").max(2000),
});

export const activitySchema = z.object({
  id: z.string(),
  contactId: z.string(),
  text: z.string(),
  createdAt: z.string(),
  kind: z.enum(["note", "deal"]),
});

export const crmSchema = z
  .object({
    companies: companySchema.array(),
    contacts: contactSchema.array(),
    deals: dealSchema.array(),
    activities: activitySchema.array(),
  })
  .refine((data) => {
    const companies = new Set(data.companies.map((company) => company.id));

    const contacts = new Set(data.contacts.map((contact) => contact.id));
    return (
      data.contacts.every((contact) => companies.has(contact.companyId)) &&
      data.deals.every((deal) => contacts.has(deal.contactId)) &&
      data.activities.every((activity) => contacts.has(activity.contactId))
    );
  }, "CRM 관계가 올바르지 않습니다.");

export const crmSearchSchema = z.object({
  q: z.string().catch(""),
  company: z.string().catch(""),
});

export type CrmData = z.infer<typeof crmSchema>;

export type Contact = z.infer<typeof contactSchema>;

export type Deal = z.infer<typeof dealSchema>;

export type ContactInput = z.infer<typeof contactInputSchema>;

export type DealInput = z.infer<typeof dealInputSchema>;

export type DealStage = (typeof dealStages)[number];
