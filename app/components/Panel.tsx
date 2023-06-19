import { useState, type ReactNode } from "react";
import { Button } from "./Button";

export function Panel({
  title,
  emptyText,
  children,
  addForm,
}: {
  title: string;
  emptyText: string;
  addForm?: ReactNode;
  children?: ReactNode;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  return (
    <div className="bg-white dark:bg-black rounded-md shadow overflow-hidden divide-y divide-neutral-300 dark:divide-neutral-800">
      <h3 className="bg-neutral-50 dark:bg-neutral-800 flex items-center px-4 py-3">
        <span className="flex-grow">{title}</span>
        {!!addForm && (
          <Button
            className="float-right opacity-50 hover:opacity-100"
            icon="user"
            onClick={() => setShowAddForm(!showAddForm)}
          />
        )}
      </h3>
      {showAddForm && addForm}
      {Array.isArray(children) && children.length ? (
        children
      ) : (
        <div className="py-16 text-center px-4">{emptyText}</div>
      )}
    </div>
  );
}
