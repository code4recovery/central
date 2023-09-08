export function Columns({
  primary,
  children,
}: {
  primary: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 items-start md:grid-cols-3">
      <div className="grid gap-6 mt-0 md:col-span-2">{primary}</div>
      <div className="md:col-span-1">
        <div className="grid gap-6 px-4 sm:px-0">{children}</div>
      </div>
    </div>
  );
}
