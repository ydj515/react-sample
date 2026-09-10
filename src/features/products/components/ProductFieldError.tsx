export function ProductFieldError({
  message,
  id,
}: {
  message?: string;
  id?: string;
}) {
  return message ? (
    <span id={id} className="text-negative text-xs" role="alert">
      {message}
    </span>
  ) : null;
}
