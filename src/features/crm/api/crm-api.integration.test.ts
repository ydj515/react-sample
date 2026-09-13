import { describe, expect, it } from "vitest";
import {
  getCrm,
  createContact,
  createDeal,
  moveDeal,
  addNote,
} from "./crm-api";

describe("CRM relationships", () => {
  it("connects a contact, company, deal and activity", async () => {
    const data = await getCrm();

    const contact = await createContact({
      name: "새 담당자",
      email: "new@example.com",
      companyId: data.companies[0].id,
    });

    const deal = await createDeal({
      title: "새 계약",
      contactId: contact.id,
      amount: 1000000,
    });
    await moveDeal(deal.id, "won");
    await addNote(contact.id, "다음 주 킥오프");
    const updated = await getCrm();
    expect(updated.deals.find((item) => item.id === deal.id)).toMatchObject({
      stage: "won",
      contactId: contact.id,
    });
    expect(
      updated.activities.filter((item) => item.contactId === contact.id),
    ).toHaveLength(3);
  });
  it("rejects dangling relations and invalid input", async () => {
    await expect(
      createContact({
        name: "연락처",
        email: "user@example.com",
        companyId: "missing",
      }),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      createDeal({ title: "거래", contactId: "missing", amount: 1 }),
    ).rejects.toMatchObject({ status: 400 });
    await expect(moveDeal("missing", "won")).rejects.toMatchObject({
      status: 404,
    });
    await expect(addNote("missing", "메모")).rejects.toMatchObject({
      status: 404,
    });
    await expect(addNote("contact-1", "")).rejects.toMatchObject({
      status: 400,
    });
  });
});
