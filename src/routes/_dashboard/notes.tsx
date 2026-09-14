import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/features/notes/pages/notes";

export const Route = createFileRoute("/_dashboard/notes")({
  component: NotesPage,
});
