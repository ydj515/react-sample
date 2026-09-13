import { http, HttpResponse } from "msw";
import { z } from "zod";
import {
  contactInputSchema,
  dealInputSchema,
  noteInputSchema,
  dealStages,
} from "@/features/crm/model";
import type { CrmData } from "@/features/crm/model";
import { createMockApiError } from "./api-error";

const fixture: CrmData = {
  companies: [
    { id: "company-1", name: "노스스타 스튜디오", industry: "디자인" },
    { id: "company-2", name: "리버 테크", industry: "소프트웨어" },
  ],
  contacts: [
    {
      id: "contact-1",
      name: "김서연",
      email: "seoyeon@example.com",
      companyId: "company-1",
    },
    {
      id: "contact-2",
      name: "이준호",
      email: "junho@example.com",
      companyId: "company-2",
    },
  ],
  deals: [
    {
      id: "deal-1",
      title: "브랜드 사이트 개편",
      contactId: "contact-1",
      amount: 12000000,
      stage: "proposal",
    },
    {
      id: "deal-2",
      title: "관리자 포털 구축",
      contactId: "contact-2",
      amount: 25000000,
      stage: "qualified",
    },
  ],
  activities: [
    {
      id: "activity-1",
      contactId: "contact-1",
      text: "요구사항 미팅 완료. 다음 주 제안서 전달 예정.",
      kind: "note",
      createdAt: "2026-09-01T09:00:00Z",
    },
  ],
};

let data = structuredClone(fixture);

export function resetCrmMockData() {
  data = structuredClone(fixture);
}

function error(request: Request, status: number, message: string) {
  return createMockApiError({
    status,
    code: status === 404 ? "CRM_NOT_FOUND" : "INVALID_CRM_INPUT",
    message,
    path: new URL(request.url).pathname,
  });
}

function activity(contactId: string, text: string, kind: "note" | "deal") {
  const item = {
    id: crypto.randomUUID(),
    contactId,
    text,
    kind,
    createdAt: new Date().toISOString(),
  };
  data.activities.unshift(item);
  return item;
}

export const crmHandlers = [
  http.get("/api/crm", () => HttpResponse.json(data)),
  http.post("/api/crm/contacts", async ({ request }) => {
    const parsed = contactInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (
      !parsed.success ||
      !data.companies.some((company) => company.id === parsed.data.companyId)
    ) {
      return error(request, 400, "연락처와 회사 정보를 확인하세요.");
    }
    const contact = { ...parsed.data, id: crypto.randomUUID() };
    data.contacts.push(contact);
    return HttpResponse.json(contact, { status: 201 });
  }),
  http.post("/api/crm/deals", async ({ request }) => {
    const parsed = dealInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (
      !parsed.success ||
      !data.contacts.some((contact) => contact.id === parsed.data.contactId)
    ) {
      return error(request, 400, "딜과 연결할 연락처를 확인하세요.");
    }
    const deal = {
      ...parsed.data,
      id: crypto.randomUUID(),
      stage: "lead" as const,
    };
    data.deals.push(deal);
    activity(deal.contactId, `${deal.title} 딜 생성`, "deal");
    return HttpResponse.json(deal, { status: 201 });
  }),
  http.post("/api/crm/deals/:id/stage", async ({ params, request }) => {
    const deal = data.deals.find((item) => item.id === params.id);
    if (!deal) return error(request, 404, "딜을 찾을 수 없습니다.");
    const parsed = z
      .object({ stage: z.enum(dealStages) })
      .safeParse(await request.json().catch(() => null));
    if (!parsed.success) return error(request, 400, "단계를 확인하세요.");
    if (deal.stage !== parsed.data.stage) {
      activity(
        deal.contactId,
        `${deal.title}: ${deal.stage} → ${parsed.data.stage}`,
        "deal",
      );
      deal.stage = parsed.data.stage;
    }
    return HttpResponse.json(deal);
  }),
  http.post("/api/crm/contacts/:id/notes", async ({ params, request }) => {
    const contact = data.contacts.find((item) => item.id === params.id);
    if (!contact) return error(request, 404, "연락처를 찾을 수 없습니다.");
    const parsed = noteInputSchema.safeParse(
      await request.json().catch(() => null),
    );
    if (!parsed.success) return error(request, 400, "메모를 입력하세요.");
    return HttpResponse.json(activity(contact.id, parsed.data.text, "note"), {
      status: 201,
    });
  }),
];
