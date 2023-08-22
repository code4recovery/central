import { db } from "./db.server";

export async function searchGroups(search: string, accountID: string) {
  const result = await db.group.findRaw({
    filter: {
      $text: {
        $search: search,
      },
      accountID: { $oid: accountID },
    },
  });
  if (!Array.isArray(result) || !result.length) {
    return [];
  }
  return result.map(({ _id }) => _id["$oid"]) as string[];
}
