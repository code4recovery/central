import { PrismaClient } from "@prisma/client";
import md5 from "blueimp-md5";
import { DateTime } from "luxon";

import { getGoogleSheet } from "~/helpers";
import { strings } from "~/i18n";

const db = new PrismaClient();
const typesNotFound: string[] = [];
const languagesNotFound: string[] = [];

type Meeting = {
  accounts: { connect: { id: string } };
  day?: number;
  duration?: number;
  name: string;
  notes?: string;
  slug?: string;
  start?: Date;
  time?: string;
  timezone?: string;
  languages?: { connect: { code?: string }[] };
  types?: { connect: { code?: string }[] };
};

async function seed() {
  await db.change.deleteMany();
  await db.activity.deleteMany();
  await db.meeting.deleteMany();

  const url = "https://aa-intergroup.org/meetings";
  let account = await db.account.findFirst();
  if (!account) {
    account = await db.account.create({
      data: {
        name: "Online Intergroup of AA",
        url,
        theme: "sky",
      },
    });
  }

  const meetings = await getMeetings(account.id);

  for (const data of meetings) {
    await db.meeting.create({
      data,
    });
  }

  const email = process.env.USER_EMAIL;
  if (email) {
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
          adminAccounts: { connect: { id: account.id } },
          currentAccountID: account.id,
        },
      });
    }
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

async function getMeetings(accountID: string): Promise<Meeting[]> {
  // fetch sheet
  const rows = await getGoogleSheet(
    "1tYV4wBZkY_3hp0tresN6iZBCwOyqkK-dz4UAWQPI1Vs"
  );
  const meetings: Meeting[] = [];

  rows.slice(120, 140).forEach((row) => {
    const meeting = {
      name: row.name,
      timezone: row.timezone,
      notes: row.notes,
      types: convertTypes(row.types),
      languages: connectLanguages(row.languages, row.types),
      conference_url: row.url,
      conference_url_notes: row.access_code,
      accounts: { connect: { id: accountID } },
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

const connectLanguages = (languages: string, types: string) => {
  let normalized = [
    ...new Set([
      ...languages
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
        .filter((e) => e),
      ...types
        .split(",")
        .map((e) => e.trim())
        .map((e) => {
          const index = Object.values(strings.languages).indexOf(e);
          if (index !== -1) {
            return Object.keys(strings.languages)[index];
          }
        })
        .filter((e) => e),
    ]),
  ];
  if (!normalized.length) normalized = ["EN"];
  return { connect: normalized.map((code) => ({ code })) };
};

const convertTypes = (types: string) => {
  const normalized = [
    ...new Set(
      types
        .replace("Steps / Traditions", "Step Study, Tradition Study")
        .replace("12&12", "12 Steps & 12 Traditions")
        .replace("Deaf/Hard of Hearing", "Deaf / Hard of Hearing")
        .replace("ASL", "American Sign Language")
        .replace("BIPOC", "People of Color")
        .replace("Newcomers", "Newcomer")
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
  ];
  return normalized.length
    ? {
        connect: normalized.map((code) => ({
          code,
        })),
      }
    : undefined;
};
