import type { ReactNode } from "react";

import { formatDate } from "~/helpers";
import { Avatar } from "./Avatar";

export function PanelRow({
  user,
  text,
  date,
  deleteButton,
}: {
  user: { emailHash: string; name: string };
  text?: string | null;
  date?: string | null;
  deleteButton?: ReactNode;
}) {
  return (
    <div className="flex justify-between gap-3 w-full px-4 py-3 items-center">
      <Avatar emailHash={user.emailHash} name={user.name} />
      <span className="grow">{text}</span>
      {date && <span>{formatDate(date)}</span>}
      {deleteButton && <span>{deleteButton}</span>}
    </div>
  );
}
