import { config } from "~/helpers";
import { db } from "./db.server";

export async function getGroupCount(accountID: string) {
  return await db.group.count({ where: { accountID } });
}

export async function getGroups(accountID: string, skip?: number) {
  return await db.group.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      updatedAt: true,
      meetings: {
        select: {
          id: true,
        },
      },
      users: {
        select: {
          id: true,
          emailHash: true,
          name: true,
        },
      },
    },
    skip,
    take: config.batchSize,
    where: { accountID },
  });
}
