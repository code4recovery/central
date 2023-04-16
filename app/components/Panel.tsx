export function Panel({
  title,
  emptyText,
  children,
}: {
  title: string;
  emptyText: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-black rounded-md shadow overflow-hidden divide-y divide-neutral-300 dark:divide-neutral-800">
      <h3 className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3">{title}</h3>
      {Array.isArray(children) && children.length ? (
        children
      ) : (
        <div className="py-16 text-center px-4">{emptyText}</div>
      )}
    </div>
  );
}
