import type { LoaderArgs } from "@remix-run/node";

import { formatJson } from "~/helpers";
import { getAllMeetingsForJson } from "~/models";
import { db } from "~/utils";

export async function loader({ params: { accountID } }: LoaderArgs) {
  const account = await db.account.findFirstOrThrow({
    where: { id: accountID },
  });
  const meetings = await getAllMeetingsForJson(account.id);
  return formatJson(meetings, account.url);
}
