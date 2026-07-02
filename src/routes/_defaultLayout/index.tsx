import { createFileRoute } from "@tanstack/react-router";
import ModalExample from "@/components/modal/ModalExample";
export const Route = createFileRoute("/_defaultLayout/")({
  component: DefaultHome,
});

export function DefaultHome() {
  return (
    <>
      <ModalExample />
    </>
  );
}
