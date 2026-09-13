import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactInputSchema,
  dealInputSchema,
} from "@/features/crm/model/crm-schema";
import type {
  ContactInput,
  DealInput,
  CrmData,
} from "@/features/crm/model/crm-schema";
import { useCrmMutations } from "@/features/crm/queries/crm-queries";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export function CrmForms({ data }: { data: CrmData }) {
  const mutations = useCrmMutations();

  const contact = useForm<ContactInput>({
    resolver: zodResolver(contactInputSchema),
    defaultValues: {
      name: "",
      email: "",
      companyId: data.companies[0]?.id ?? "",
    },
  });

  const deal = useForm<DealInput>({
    resolver: zodResolver(dealInputSchema),
    defaultValues: {
      title: "",
      amount: 0,
      contactId: data.contacts[0]?.id ?? "",
    },
  });
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <h2 className="mb-4 font-semibold">연락처 추가</h2>
        <form
          noValidate
          className="grid gap-3"
          onSubmit={(event) => {
            void contact.handleSubmit((values) =>
              mutations.contact.mutate(values, {
                onSuccess: () => contact.reset(),
              }),
            )(event);
          }}
        >
          <fieldset
            disabled={mutations.contact.isPending}
            className="grid gap-3"
          >
            <label className="grid gap-1 text-sm">
              담당자 이름
              <Input
                {...contact.register("name")}
                aria-invalid={!!contact.formState.errors.name}
              />
            </label>
            <label className="grid gap-1 text-sm">
              이메일
              <Input
                type="email"
                {...contact.register("email")}
                aria-invalid={!!contact.formState.errors.email}
              />
            </label>
            <label className="grid gap-1 text-sm">
              소속 회사
              <Select {...contact.register("companyId")}>
                {data.companies.map((company) => (
                  <option value={company.id} key={company.id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            </label>
            {Object.values(contact.formState.errors).map((error, i) => (
              <p role="alert" key={i} className="text-negative text-sm">
                {error.message}
              </p>
            ))}
            <Button type="submit" disabled={mutations.contact.isPending}>
              연락처 저장
            </Button>
          </fieldset>
          {mutations.contact.error && (
            <p role="alert" className="text-negative text-sm">
              {mutations.contact.error.message}
            </p>
          )}
          {mutations.contact.isSuccess && (
            <p role="status" className="text-sm">
              연락처를 저장했습니다.
            </p>
          )}
        </form>
      </Card>
      <Card className="p-5">
        <h2 className="mb-4 font-semibold">딜 추가</h2>
        <form
          noValidate
          className="grid gap-3"
          onSubmit={(event) => {
            void deal.handleSubmit((values) =>
              mutations.deal.mutate(values, { onSuccess: () => deal.reset() }),
            )(event);
          }}
        >
          <fieldset disabled={mutations.deal.isPending} className="grid gap-3">
            <label className="grid gap-1 text-sm">
              딜 이름
              <Input
                {...deal.register("title")}
                aria-invalid={!!deal.formState.errors.title}
              />
            </label>
            <label className="grid gap-1 text-sm">
              금액 (원)
              <Input
                type="number"
                min={0}
                step={1}
                {...deal.register("amount", { valueAsNumber: true })}
                aria-invalid={!!deal.formState.errors.amount}
              />
            </label>
            <label className="grid gap-1 text-sm">
              연결 연락처
              <Select {...deal.register("contactId")}>
                {data.contacts.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name} ·{" "}
                    {
                      data.companies.find(
                        (company) => company.id === item.companyId,
                      )?.name
                    }
                  </option>
                ))}
              </Select>
            </label>
            {Object.values(deal.formState.errors).map((error, i) => (
              <p role="alert" key={i} className="text-negative text-sm">
                {error.message}
              </p>
            ))}
            <Button type="submit" disabled={mutations.deal.isPending}>
              딜 저장
            </Button>
          </fieldset>
          {mutations.deal.error && (
            <p role="alert" className="text-negative text-sm">
              {mutations.deal.error.message}
            </p>
          )}
          {mutations.deal.isSuccess && (
            <p role="status" className="text-sm">
              딜을 저장했습니다.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
