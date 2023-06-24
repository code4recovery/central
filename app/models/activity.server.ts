import { db } from "../utils/db.server";
import { config } from "~/helpers";

// todo restrict to account
export function getActivity(_accountID: string, skip?: number) {
  return db.activity.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      createdAt: true,
      changes: {
        select: { field: true },
      },
      meeting: {
        select: {
          id: true,
          name: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      type: true,
      user: {
        select: {
          name: true,
          emailHash: true,
        },
      },
    },
    skip,
    take: config.batchSize,
  });
}

// todo restrict to account
export function getActivityCount(_accountID: string) {
  return db.activity.count();
}
