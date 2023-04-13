import { db } from "./db.server";

export async function searchMeetings(search: string, accountID: string) {
  if (!search) {
    return [];
  }
  const searchString = search
    .split('"')
    .join("")
    .split(" ")
    .filter((e) => e)
    .map((e) => `"${e}"`)
    .join(" ");
  const result = await db.meeting.findRaw({
    filter: {
      $text: {
        $search: searchString,
      },
      accountID: { $oid: accountID },
    },
  });
  if (!Array.isArray(result) || !result.length) {
    return [];
  }
  return result.map(({ _id }) => _id["$oid"]) as string[];
}
