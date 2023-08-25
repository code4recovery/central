import { db } from "../utils/db.server";

export async function getAccount(accountID: string) {
  return await db.account.findUnique({
    where: { id: accountID },
    select: {
      id: true,
      name: true,
      url: true,
      updatedAt: true,
    },
  });
}

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
