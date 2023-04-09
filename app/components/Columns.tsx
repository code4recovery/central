export function Columns({
  primary,
  children,
}: {
  primary: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="mt-5 md:col-span-2 md:mt-0">{primary}</div>
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">{children}</div>
      </div>
    </div>
  );
}
