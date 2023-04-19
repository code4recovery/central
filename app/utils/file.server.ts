import { Storage } from "@google-cloud/storage";

import { db } from "./db.server";
import { log } from "./log.server";

export async function saveFeedToStorage(accountID: string) {
  const projectId = process.env.GOOGLE_CLOUD_BUCKET ?? "";
  const private_key = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.split(
    String.raw`\n`
  ).join("\n");
  const client_email = `${projectId}@${projectId}.iam.gserviceaccount.com`;

  const filename = `${accountID}.json`;

  if (!projectId || !private_key) {
    throw Error(
      "need GOOGLE_CLOUD_BUCKET and GOOGLE_CLOUD_PRIVATE_KEY env vars"
    );
  }

  const storage = new Storage({
    projectId,
    credentials: {
      private_key,
      client_email,
    },
  });

  const meetings = (
    await db.meeting.findMany({
      select: {
        slug: true,
        id: true,
        name: true,
        languages: { select: { code: true } },
        types: { select: { code: true } },
        timezone: true,
        notes: true,
        day: true,
        time: true,
        conference_url: true,
        conference_url_notes: true,
        conference_phone: true,
        conference_phone_notes: true,
        updatedAt: true,
        group: {
          select: {
            name: true,
            notes: true,
            email: true,
            phone: true,
            website: true,
            venmo: true,
            paypal: true,
            square: true,
            updatedAt: true,
          },
        },
      },
      where: {
        archived: false,
        group: {
          accountID,
        },
      },
    })
  )
    .map(
      ({
        slug,
        id,
        name,
        timezone,
        notes,
        languages,
        types,
        day,
        time,
        conference_url,
        conference_url_notes,
        conference_phone,
        conference_phone_notes,
        updatedAt,
        group,
      }) => ({
        slug: slug || id,
        name,
        timezone,
        notes,
        types: [
          ...languages.map(({ code }) => code),
          ...types.map(({ code }) => code),
        ],
        day,
        time,
        conference_url,
        conference_url_notes,
        conference_phone,
        conference_phone_notes,
        group: group.name,
        group_notes: group.notes,
        email: group.email,
        phone: group.phone,
        website: group.website,
        venmo: group.venmo,
        paypal: group.paypal,
        square: group.square,
        updated: updatedAt
          .toISOString()
          .split("T")
          .join(" ")
          .split("Z")
          .join(""), // todo use group and meeting whichever is later
      })
    )
    .map((entry) =>
      Object.entries(entry)
        .filter(([_, v]) => v !== null && v !== "") // remove null / empty values
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
    );

  const contents = JSON.stringify(meetings);

  await storage.bucket(projectId).file(filename).save(contents);

  const feedURL = `https://${projectId}.storage.googleapis.com/${filename}`;

  log(`wrote ${meetings.length} entries to ${feedURL}`);

  return feedURL;
}
