import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { LandingContainer } from "./LandingContainer";
export function LandingSection({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn("scroll-mt-24 py-16 sm:py-24", className)}
      {...props}
    >
      <LandingContainer>{children}</LandingContainer>
    </section>
  );
}
