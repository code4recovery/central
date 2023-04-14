import { formatDate } from "~/helpers";
import { Avatar } from "./Avatar";

export function PanelRow({
  user,
  text,
  date,
}: {
  user: { emailHash: string; name: string };
  text?: string | null;
  date?: string | null;
}) {
  return (
    <div className="flex justify-between gap-3 w-full px-4 py-3">
      <Avatar emailHash={user.emailHash} name={user.name} />
      <span className="grow">{text}</span>
      <span>{formatDate(date)}</span>
    </div>
  );
}
