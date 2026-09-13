import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getCrm,
  createContact,
  createDeal,
  moveDeal,
  addNote,
} from "@/features/crm/api/crm-api";
import type { DealStage } from "@/features/crm/model/crm-schema";

export const crmOptions = () =>
  queryOptions({ queryKey: ["crm"], queryFn: getCrm });

export function useCrmMutations() {
  const client = useQueryClient();

  const onSuccess = async () => {
    await client.invalidateQueries({ queryKey: ["crm"] });
  };

  const contact = useMutation({ mutationFn: createContact, onSuccess });

  const deal = useMutation({ mutationFn: createDeal, onSuccess });

  const stage = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: DealStage }) =>
      moveDeal(id, stage),
    onSuccess,
  });

  const note = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) =>
      addNote(id, text),
    onSuccess,
  });
  return { contact, deal, stage, note };
}
