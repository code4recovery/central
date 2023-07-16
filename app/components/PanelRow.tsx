import type { ReactNode } from "react";

import { formatClasses as cx, formatDate } from "~/helpers";
import { Avatar } from "./Avatar";

export function PanelRow({
  date,
  deleteButton,
  onClick,
  text,
  user,
}: {
  date?: string | null;
  deleteButton?: ReactNode;
  onClick?: () => void;
  text?: string | null;
  user: { emailHash: string; name: string };
}) {
  return (
    <div
      className={cx(
        "flex justify-between gap-3 w-full px-4 py-3 items-center",
        {
          "cursor-pointer": !!onClick,
        }
      )}
      onClick={onClick}
    >
      <Avatar emailHash={user.emailHash} name={user.name} />
      <span className="grow">{text}</span>
      {date && <span>{formatDate(date)}</span>}
      {deleteButton && <span>{deleteButton}</span>}
    </div>
  );
}
