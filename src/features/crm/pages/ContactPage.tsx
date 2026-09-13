import { Link, useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  crmOptions,
  useCrmMutations,
} from "@/features/crm/queries/crm-queries";
import { noteInputSchema, stageLabels } from "@/features/crm/model/crm-schema";
import { PageHeader } from "@/shared/ui/page-header";
import { Card } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { QueryBoundary } from "@/shared/ui/query-boundary";

function ContactContent() {
  const { contactId } = useParams({ strict: false });

  const { data } = useSuspenseQuery(crmOptions());

  const contact = data.contacts.find((item) => item.id === contactId);

  const { note } = useCrmMutations();

  const form = useForm<{ text: string }>({
    resolver: zodResolver(noteInputSchema),
    defaultValues: { text: "" },
  });
  if (!contact) {
    return (
      <Card role="alert" className="p-6">
        연락처를 찾을 수 없습니다.{" "}
        <Link
          to="/crm"
          search={{ q: "", company: "" }}
          className="text-brand underline"
        >
          CRM으로 돌아가기
        </Link>
      </Card>
    );
  }
  const company = data.companies.find((item) => item.id === contact.companyId);

  const deals = data.deals.filter((item) => item.contactId === contact.id);

  const activities = data.activities.filter(
    (item) => item.contactId === contact.id,
  );
  return (
    <section className="grid gap-6">
      <PageHeader
        title={contact.name}
        description={`${company?.name} · ${contact.email}`}
        actions={
          <Link
            to="/crm"
            search={{ q: "", company: "" }}
            className="text-brand underline"
          >
            CRM으로 돌아가기
          </Link>
        }
      />
      <Card className="p-5">
        <h2 className="mb-4 font-semibold">연결된 딜</h2>
        {!deals.length && <p className="text-sm">연결된 딜이 없습니다.</p>}
        <ul className="space-y-3">
          {deals.map((deal) => (
            <li
              key={deal.id}
              className="flex flex-wrap justify-between gap-2 text-sm"
            >
              <span>{deal.title}</span>
              <span>
                {stageLabels[deal.stage]} · ₩
                {deal.amount.toLocaleString("ko-KR")}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-5">
        <h2 className="mb-4 font-semibold">메모 추가</h2>
        <form
          noValidate
          className="grid gap-3"
          onSubmit={(event) => {
            void form.handleSubmit(({ text }) =>
              note.mutate(
                { id: contact.id, text },
                { onSuccess: () => form.reset() },
              ),
            )(event);
          }}
        >
          <label className="grid gap-2 text-sm">
            활동 메모
            <Textarea
              {...form.register("text")}
              disabled={note.isPending}
              aria-invalid={!!form.formState.errors.text}
            />
          </label>
          {form.formState.errors.text && (
            <p role="alert" className="text-negative text-sm">
              {form.formState.errors.text.message}
            </p>
          )}
          <Button type="submit" disabled={note.isPending}>
            메모 저장
          </Button>
          {note.error && (
            <p role="alert" className="text-negative text-sm">
              {note.error.message}
            </p>
          )}
        </form>
      </Card>
      <Card className="p-5">
        <h2 className="mb-4 font-semibold">활동 내역</h2>
        {!activities.length && <p className="text-sm">아직 활동이 없습니다.</p>}
        <ol className="space-y-4">
          {activities.map((item) => (
            <li key={item.id} className="border-line border-l-2 pl-4">
              <p className="text-sm break-words whitespace-pre-wrap">
                {item.text}
              </p>
              <time
                className="text-ink-subtle text-xs"
                dateTime={item.createdAt}
              >
                {item.createdAt.replace("T", " ").slice(0, 16)}
              </time>
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}

export function ContactPage() {
  const { contactId } = useParams({ strict: false });
  return (
    <QueryBoundary>
      <ContactContent key={contactId} />
    </QueryBoundary>
  );
}
