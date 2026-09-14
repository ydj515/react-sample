import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "@/features/chat/pages/chat";

export const Route = createFileRoute("/_dashboard/chat")({
  component: ChatPage,
});
