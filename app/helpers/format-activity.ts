import type { Change } from "@prisma/client";

import { useTranslation } from "~/hooks";
import { getFields } from "./get-fields";

export function formatActivity({
  approved,
  changes,
  type,
}: {
  approved?: boolean | null;
  changes: Change[];
  type: "group" | "meeting";
}) {
  const strings = useTranslation();
  const fields = getFields(type, strings);
  return {
    properties: changes
      .map(({ field }) => fields[field].label?.toLocaleLowerCase())
      .join(", "),
    approved: approved === true ? "✅" : approved === false ? "❌" : "⏳",
  };
}
