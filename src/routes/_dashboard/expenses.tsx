import { createFileRoute } from "@tanstack/react-router";
import { ExpensesPage } from "@/features/expenses/pages/expenses";

export const Route = createFileRoute("/_dashboard/expenses")({
  component: ExpensesPage,
});
