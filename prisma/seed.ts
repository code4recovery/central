import { PrismaClient } from "@prisma/client";
import md5 from "blueimp-md5";
import { DateTime } from "luxon";

import { getGoogleSheet } from "~/helpers";
import { strings } from "~/i18n";

const db = new PrismaClient();
const typesNotFound: string[] = [];
const languagesNotFound: string[] = [];

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
  await db.change.deleteMany();
  await db.activity.deleteMany();
  await db.meeting.deleteMany();
  const meetings = await getMeetings();
  await Promise.all(meetings.map((data) => db.meeting.create({ data })));

  const url = "https://aa-intergroup.org/meetings";
  let account = await db.account.findFirst();
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
        admin: true, // todo
        accounts: { connect: { id: account.id } },
        currentAccountID: account.id,
      },
    });
  }

  console.log(`${meetings.length} meetings imported`);

  if (typesNotFound.length) {
    console.log({ typesNotFound });
  }

  if (languagesNotFound.length) {
    console.log({ languagesNotFound });
  }
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
      languages: convertLanguages(
        [...row.types.split(","), ...row.languages.split(",")].join(",")
      ),
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

const convertLanguages = (languages: string) =>
  [
    ...new Set(
      languages
        .split(",")
        .map((e) => e.trim())
        .map((e) => {
          const index = Object.values(strings.languages).indexOf(e);
          if (index !== -1) {
            return Object.keys(strings.languages)[index];
          }
          if (
            !languagesNotFound.includes(e) &&
            !Object.values(strings.types).includes(e)
          ) {
            languagesNotFound.push(e);
          }
        })
        .filter((e) => e)
        .sort()
    ),
  ].join();

const convertTypes = (types: string) =>
  [
    ...new Set(
      types
        .split(",")
        .map((e) => e.trim())
        .map((e) => {
          const index = Object.values(strings.types).indexOf(e);
          if (index !== -1) {
            return Object.keys(strings.types)[index];
          }
          if (
            !typesNotFound.includes(e) &&
            !Object.values(strings.languages).includes(e)
          ) {
            typesNotFound.push(e);
          }
        })
        .filter((e) => e)
        .sort()
    ),
  ].join();
