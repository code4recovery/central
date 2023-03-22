import { PrismaClient } from "@prisma/client";
import md5 from "blueimp-md5";

import { config, getGoogleSheet } from "~/helpers";

const db = new PrismaClient();

type Meeting = {
  name: string;
  slug: string;
  day?: number;
  time?: string;
  start?: Date;
  duration?: number;
  timezone?: string;
};

async function seed() {
  await db.account.deleteMany();
  await db.meeting.deleteMany();
  await db.user.deleteMany();
  const meetings = await getMeetings();
  await Promise.all(meetings.map((data) => db.meeting.create({ data })));

  const email = process.env.USER_EMAIL ?? "foo@example.com";
  await db.user.create({
    data: {
      name: process.env.USER_NAME,
      email,
      emailHash: md5(email),
      accounts: {
        create: [
          {
            name: "Online Intergroup of AA",
            url: "https://aa-intergroup.org/meetings",
            meetingCount: meetings.length,
            theme: "rose",
          },
        ],
      },
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

  rows.slice(0, 20).forEach((row) => {
    row.times
      .split("\n")
      .filter((e) => e.includes(":")) //make sure there's a time
      .forEach((dayTime) => {
        meetings.push({
          name: row.name,
          slug: row.slug,
          start: convertDayTime(dayTime),
          timezone: row.timezone,
        });
      });
  });

  return meetings;
}

function convertDayTime(dayTime: string) {
  let [day, time, ampm] = dayTime.toLowerCase().split(" ");
  const dayIndex = config.days.indexOf(day);
  const date = new Date();
  const dayDiff = dayIndex - date.getDay();
  date.setDate(date.getDate() + dayDiff);
  let [hours, minutes] = time.split(":").map((e) => Number(e));
  if (ampm === "PM") hours = hours + 12;
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
