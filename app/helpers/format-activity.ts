import type { Change } from "@prisma/client";

import { fields } from "./fields";

export function formatActivity({
  approved,
  changes,
  type,
}: {
  approved?: boolean | null;
  changes: Change[];
  type: "group" | "meeting";
}) {
  return {
    properties: changes
      .map(({ field }) => fields[type][field].label?.toLocaleLowerCase())
      .join(", "),
    approved: approved === true ? "✅" : approved === false ? "❌" : "⏳",
  };
}
