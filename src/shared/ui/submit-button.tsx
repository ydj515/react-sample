import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./button";

export function SubmitButton({
  children,
  pendingLabel = "저장 중…",
  disabled,
  ...props
}: Omit<ButtonProps, "type" | "asChild"> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
