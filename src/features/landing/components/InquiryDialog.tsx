import { X } from "lucide-react";
import { Button, type ButtonProps } from "@/shared/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/shared/ui/dialog";
import { InquiryForm } from "./InquiryForm";

export function InquiryDialog({
  label,
  context,
  description,
  variant = "primary",
  triggerClassName,
}: {
  label: string;
  context: string;
  description: string;
  variant?: ButtonProps["variant"];
  triggerClassName?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={triggerClassName}>
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="text-lg font-bold">{context}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="신청 창 닫기">
              <X aria-hidden />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="text-ink-muted mt-2 mb-6 text-sm leading-6">
          {description}
        </DialogDescription>
        <InquiryForm context={context} />
      </DialogContent>
    </Dialog>
  );
}
