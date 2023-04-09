export function Panel({
  title,
  emptyText,
}: {
  title: string;
  emptyText: string;
}) {
  return (
    <div className="bg-white dark:bg-black rounded-md shadow overflow-hidden">
      <h3 className="bg-neutral-50 dark:bg-neutral-800 px-4 py-3 border-b border-neutral-300 dark:border-neutral-700">
        {title}
      </h3>
      <div className="py-16 text-center px-4">{emptyText}</div>
    </div>
  );
}
