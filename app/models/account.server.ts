import { db } from "../utils/db.server";

// todo think about naming
export async function getAccountCounts(accountID: string) {
  const result = await db.account.findFirst({
    where: { id: accountID },
    select: { _count: { select: { meetings: true, groups: true } } },
  });
  return {
    meetingCount: result?._count.meetings,
    groupCount: result?._count.groups,
  };
}
