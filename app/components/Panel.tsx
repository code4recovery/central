import type { ReactNode } from "react";

export function Panel({
  button,
  children,
  emptyText,
  title,
}: {
  button?: ReactNode;
  children?: ReactNode;
  emptyText: string;
  title: string;
}) {
  return (
    <div className="bg-white dark:bg-black rounded-md shadow overflow-hidden divide-y divide-neutral-300 dark:divide-neutral-800">
      <h3 className="bg-neutral-50 dark:bg-neutral-800 flex items-center px-4 py-3">
        <span className="flex-grow">{title}</span>
        {!!button && button}
      </h3>
      {Array.isArray(children) && children.length ? (
        children
      ) : (
        <div className="py-16 text-center px-4">{emptyText}</div>
      )}
    </div>
  );
}
