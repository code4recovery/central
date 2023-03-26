import { PrismaClient } from "@prisma/client";
import md5 from "blueimp-md5";
import { DateTime } from "luxon";

import { getGoogleSheet } from "~/helpers";
import { strings } from "~/i18n";

const db = new PrismaClient();

type Meeting = {
  day?: number;
  duration?: number;
  name: string;
  notes?: string;
  slug?: string;
  start?: Date;
  time?: string;
  timezone?: string;
};

async function seed() {
  await db.meeting.deleteMany();
  const meetings = await getMeetings();
  await Promise.all(meetings.map((data) => db.meeting.create({ data })));

  const url = "https://aa-intergroup.org/meetings";
  let account = await db.account.findFirst({ where: { url } });
  if (!account) {
    account = await db.account.create({
      data: {
        name: "Online Intergroup of AA",
        url,
        meetingCount: meetings.length,
        theme: "sky",
      },
    });
  }

  const email = process.env.USER_EMAIL ?? "foo@example.com";
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    await db.user.create({
      data: {
        name: process.env.USER_NAME ?? "Joe Q.",
        email,
        emailHash: md5(email),
        accounts: { connect: { id: account.id } },
        currentAccountID: account.id,
      },
    });
  }

  console.log(`${meetings.length} meetings imported`);
}

seed();

async function getMeetings(): Promise<Meeting[]> {
  // fetch sheet
  const rows = await getGoogleSheet(
    "1tYV4wBZkY_3hp0tresN6iZBCwOyqkK-dz4UAWQPI1Vs"
  );
  const meetings: Meeting[] = [];

  rows.slice(50, 100).forEach((row) => {
    const meeting = {
      name: row.name,
      timezone: row.timezone,
      notes: row.notes,
      types: convertTypes(row.types),
      conference_url: row.url,
      conference_url_notes: row.access_code,
    };
    if (!row.times.length) {
      meetings.push(meeting);
    } else {
      row.times
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e)
        .forEach((dayTime) =>
          meetings.push({
            ...meeting,
            ...convertDayTime(dayTime, meeting.timezone),
          })
        );
    }
  });

  return meetings;
}

const convertDayTime = (dayTime: string, timezone: string) => {
  const start = DateTime.fromFormat(dayTime, "cccc h:mm a", {
    zone: timezone,
  });

  if (!start.isValid) {
    console.error(`invalid ${dayTime} ${timezone}: ${start.invalidReason}`);
    return {
      day: undefined,
      time: undefined,
      timezone: undefined,
    };
  }

  return {
    day: start.weekday === 7 ? 0 : start.weekday,
    time: start.toFormat("HH:mm"),
    timezone: start.toFormat("z"),
  };
};

const allTypes = { ...strings.types, ...strings.language_types };
const typeKeys = Object.keys(allTypes);
const typeValues = Object.values(allTypes);
const notFound: string[] = [];

const convertTypes = (types: string) =>
  types
    .split(",")
    .map((type) => type.trim())
    .map((type) => {
      const typeIndex = typeValues.indexOf(type);
      if (typeIndex !== -1) {
        return typeKeys[typeIndex];
      }
      if (!notFound.includes(type)) {
        console.error(`type not found: ${type}`);
      }
    })
    .filter((e) => e)
    .sort()
    .join();
