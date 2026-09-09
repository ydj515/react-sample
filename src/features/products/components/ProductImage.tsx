import { cn } from "@/shared/lib/cn";

export function ProductImage({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className={cn(
        "rounded-control bg-surface-muted aspect-square object-contain",
        className,
      )}
    />
  );
}
