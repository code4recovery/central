import SFTPClient from "ssh2-sftp-client";
import { Buffer } from "buffer";

import { log } from "./log.server";
import { formatJson } from "~/helpers";
import { getAllMeetingsForJson } from "~/models";

export async function publishDataToFtp() {
  const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_DIRECTORY, JSON_FILENAME } =
    process.env;

  if (!FTP_HOST) {
    throw Error("need FTP_HOST env var");
  }

  const meetings = await getAllMeetingsForJson();
  const data = formatJson(meetings);
  const filename = `${FTP_DIRECTORY}/${JSON_FILENAME}`;

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
