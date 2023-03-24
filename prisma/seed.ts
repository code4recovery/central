import { PrismaClient } from "@prisma/client";
import md5 from "blueimp-md5";

import { config, getGoogleSheet } from "~/helpers";
import { strings } from "~/i18n";

const db = new PrismaClient();

type Meeting = {
  day?: number;
  duration?: number;
  name: string;
  notes?: string;
  slug: string;
  start?: Date;
  time?: string;
  timezone?: string;
};

async function seed() {
  await db.account.deleteMany();
  await db.meeting.deleteMany();
  await db.user.deleteMany();
  const meetings = await getMeetings();
  await Promise.all(meetings.map((data) => db.meeting.create({ data })));

  const account = await db.account.create({
    data: {
      name: "Online Intergroup of AA",
      url: "https://aa-intergroup.org/meetings",
      meetingCount: meetings.length,
      theme: "rose",
    },
  });

  const email = process.env.USER_EMAIL ?? "foo@example.com";
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

seed();

async function getMeetings(): Promise<Meeting[]> {
  // fetch sheet
  const rows = await getGoogleSheet(
    "1tYV4wBZkY_3hp0tresN6iZBCwOyqkK-dz4UAWQPI1Vs"
  );
  const meetings: Meeting[] = [];

  rows.slice(0, 50).forEach((row) => {
    const meeting = {
      name: row.name,
      slug: row.slug,
      timezone: row.timezone,
      notes: row.notes,
      types: convertTypes(row.types),
    };
    if (!row.times.trim().length) {
      meetings.push(meeting);
    } else {
      row.times
        .split("\n")
        .filter((e) => e.includes(":")) //make sure there's a time
        .forEach((dayTime) =>
          meetings.push({
            ...meeting,
            ...convertDayTime(dayTime),
          })
        );
    }
  });

  return meetings;
}

const convertDayTime = (dayTime: string) => {
  let [dayName, time, ampm] = dayTime.toLowerCase().split(" ");
  const day = config.days.indexOf(dayName);
  let [hours, minutes] = time.split(":").map((e) => Number(e));
  if (ampm === "PM") hours = hours + 12;
  time = [hours, minutes].map((n) => String(n).padStart(2, "0")).join(":");
  return { day, time };
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
        console.log(type);
      }
    })
    .filter((e) => e)
    .sort()
    .join();
