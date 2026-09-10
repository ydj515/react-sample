export function PageMetadata({
  title,
  description,
  site = "React Sample",
}: {
  title: string;
  description?: string;
  site?: string;
}) {
  return (
    <>
      <title>{`${title} | ${site}`}</title>
      <meta
        name="description"
        content={description ?? `${title} — React Sample 예제`}
      />
    </>
  );
}
