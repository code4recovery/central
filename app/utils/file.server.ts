import { Storage } from "@google-cloud/storage";

import { db } from "./db.server";

export async function saveFeedToStorage(accountID: string) {
  const bucket = process.env.GOOGLE_CLOUD_BUCKET ?? "";
  const filename = `${accountID}.json`;

  const storage = new Storage({
    projectId: bucket,
    credentials: {
      private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
      client_email: `${bucket}@${bucket}.iam.gserviceaccount.com`,
    },
  });

  const meetings = (await db.meeting.findMany()).map(
    ({
      slug,
      id,
      name,
      timezone,
      notes,
      types,
      day,
      time,
      conference_url,
      conference_url_notes,
      conference_phone,
      conference_phone_notes,
      updatedAt,
    }) => ({
      slug: slug || id,
      name,
      timezone,
      notes,
      types: types?.split(",") ?? [],
      day,
      time,
      conference_url,
      conference_url_notes,
      conference_phone,
      conference_phone_notes,
      updated: updatedAt.toISOString().split("T").join(" ").split("Z").join(""),
    })
  );

  const contents = JSON.stringify(meetings);

  await storage.bucket(bucket).file(filename).save(contents);

  return `https://${bucket}.storage.googleapis.com/${filename}`;
}