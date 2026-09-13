import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  crmOptions,
  useCrmMutations,
} from "@/features/crm/queries/crm-queries";
import { crmSearchSchema } from "@/features/crm/model/crm-schema";
import { DealPipeline } from "@/features/crm/components/DealPipeline";
import { CrmForms } from "@/features/crm/components/CrmForms";
import { PageHeader } from "@/shared/ui/page-header";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { QueryBoundary } from "@/shared/ui/query-boundary";

function CrmContent() {
  const { data } = useSuspenseQuery(crmOptions());

  const { stage } = useCrmMutations();

  const search = crmSearchSchema.parse(useSearch({ strict: false }));

  const navigate = useNavigate();

  const update = (patch: Partial<typeof search>) => {
    void navigate({
      to: "/crm",
      search: { ...search, ...patch },
      replace: true,
    });
  };

  const contacts = data.contacts.filter(
    (contact) =>
      (!search.company || contact.companyId === search.company) &&
      `${contact.name} ${contact.email}`
        .toLocaleLowerCase()
        .includes(search.q.trim().toLocaleLowerCase()),
  );

  const contactIds = new Set(contacts.map((contact) => contact.id));

  const deals = data.deals.filter((deal) => contactIds.has(deal.contactId));
  return (
    <section className="grid min-w-0 gap-6">
      <PageHeader
        title="CRM"
        description="회사와 담당자를 연결하고 영업 기회를 단계별로 관리하세요."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {data.companies.map((company) => (
          <Card className="p-4" key={company.id}>
            <button
              type="button"
              onClick={() => update({ company: company.id })}
              className="text-brand font-semibold underline"
            >
              {company.name}
            </button>
            <p className="text-ink-subtle mt-2 text-sm">
              {company.industry} · 담당자{" "}
              {
                data.contacts.filter(
                  (contact) => contact.companyId === company.id,
                ).length
              }
              명
            </p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          연락처 검색
          <Input
            value={search.q}
            onChange={(event) => update({ q: event.target.value })}
          />
        </label>
        <label className="grid gap-2 text-sm">
          회사 필터
          <Select
            value={search.company}
            onChange={(event) => update({ company: event.target.value })}
          >
            <option value="">전체 회사</option>
            {data.companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <Card className="p-5">
        <h2 className="mb-4 font-semibold">연락처 · {contacts.length}명</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {contacts.map((contact) => (
            <li key={contact.id} className="min-w-0">
              <Link
                to="/crm/contacts/$contactId"
                params={{ contactId: contact.id }}
                className="text-brand font-medium underline"
              >
                {contact.name}
              </Link>
              <p className="text-ink-subtle text-sm break-all">
                {contact.email}
              </p>
              <p className="text-ink-subtle text-xs">
                {
                  data.companies.find(
                    (company) => company.id === contact.companyId,
                  )?.name
                }
              </p>
            </li>
          ))}
        </ul>
      </Card>
      {!contacts.length && (
        <EmptyState
          title="연락처가 없습니다."
          onReset={() => update({ q: "", company: "" })}
        />
      )}
      <h2 className="text-lg font-semibold">딜 파이프라인</h2>
      {stage.error && (
        <p role="alert" className="text-negative text-sm">
          {stage.error.message} 기존 단계는 유지됩니다.
        </p>
      )}
      {stage.isSuccess && (
        <p role="status" className="text-sm">
          딜 단계를 저장했습니다.
        </p>
      )}
      <DealPipeline
        deals={deals}
        contacts={contacts}
        pending={stage.isPending}
        onMove={(id, next) => {
          if (data.deals.find((deal) => deal.id === id)?.stage !== next) {
            stage.mutate({ id, stage: next });
          }
        }}
      />
      <CrmForms data={data} />
    </section>
  );
}

export function CrmPage() {
  return (
    <QueryBoundary>
      <CrmContent />
    </QueryBoundary>
  );
}
