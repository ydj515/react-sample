import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 compact:h-9 compact:px-3 compact:text-xs",
  {
    variants: {
      variant: {
        primary:
          "bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-slate-950 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus-visible:outline-slate-300",
        secondary:
          "bg-slate-100 text-slate-950 hover:bg-slate-200 focus-visible:outline-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:outline-slate-500",
        ghost:
          "text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:outline-slate-500",
        danger:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
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

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
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
