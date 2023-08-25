import SFTPClient from "ssh2-sftp-client";
import { Buffer } from "buffer";
import { Storage } from "@google-cloud/storage";

import { log } from "./log.server";
import { formatJson } from "~/helpers";
import { getAccount, getAllMeetingsForJson } from "~/models";

export async function publishDataToFtp(accountID: string) {
  const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_DIRECTORY } = process.env;

  if (!FTP_HOST) {
    throw Error("need FTP_HOST env var");
  }

  const account = await getAccount(accountID);
  if (!account) {
    throw Error("could not find account");
  }

  const meetings = await getAllMeetingsForJson(account.id);
  const data = formatJson(meetings, account.url);
  const filename = `${FTP_DIRECTORY}/${account.id}.json`;

  const client = new SFTPClient();

  await client.connect({
    host: FTP_HOST,
    username: FTP_USER,
    password: FTP_PASSWORD,
    readyTimeout: 5000,
  });

  const content = Buffer.from(JSON.stringify(data));
  await client.put(content, filename);

  await client.end();

  log(`wrote ${meetings.length} entries to ${filename}`);

  return filename;
}

export async function publishDataToStorage(accountID: string) {
  const projectId = process.env.GOOGLE_CLOUD_BUCKET ?? "";
  const private_key = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.split(
    String.raw`\n`
  ).join("\n");
  const client_email = process.env.GOOGLE_CLOUD_CLIENT_EMAIL ?? "";

  const account = await getAccount(accountID);
  if (!account) {
    throw Error("could not find account");
  }

  const meetings = await getAllMeetingsForJson(account.id);
  const json = formatJson(meetings, account.url);
  const contents = JSON.stringify(json);
  const filename = `${account.id}.json`;

  if (!projectId || !private_key || !client_email) {
    throw Error(
      "need GOOGLE_CLOUD_BUCKET, GOOGLE_CLOUD_PRIVATE_KEY, and GOOGLE_CLOUD_CLIENT_EMAIL env vars"
    );
  }

  const storage = new Storage({
    projectId,
    credentials: {
      private_key,
      client_email,
    },
  });

  await storage.bucket(projectId).file(filename).save(contents);

  const feedURL = `https://${projectId}.storage.googleapis.com/${filename}`;

  log(`wrote ${meetings.length} entries to ${feedURL}`);

  return feedURL;
}
