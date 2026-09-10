import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-control px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 compact:h-9 compact:px-3 compact:text-sm",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-on-brand hover:bg-brand-hover focus-visible:outline-brand",
        secondary:
          "border border-line-strong bg-surface text-ink-muted hover:bg-surface-muted focus-visible:outline-brand",
        ghost:
          "text-ink-muted hover:bg-surface-muted focus-visible:outline-brand",
        danger:
          "bg-negative-soft text-negative hover:bg-negative/15 focus-visible:outline-negative",
      },
      size: {
        sm: "h-8 px-3 text-xs compact:h-7 compact:px-2.5",
        md: "h-10 px-4",
        lg: "h-11 px-5 compact:h-10 compact:px-4",
        icon: "size-10 p-0 compact:size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}
