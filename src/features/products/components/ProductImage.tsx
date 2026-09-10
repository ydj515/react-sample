import { cn } from "@/shared/lib/cn";

export function ProductImage({
  src,
  name,
  className,
  priority = false,
}: {
  src: string;
  name: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={name}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={cn(
        "rounded-control bg-surface-muted aspect-square object-contain",
        className,
      )}
    />
  );
}
