import { PrismaClient } from "@prisma/client";

import { config, getGoogleSheet } from "~/helpers";

const db = new PrismaClient();

type Meeting = {
  name: string;
  slug: string;
  day?: number;
  time?: string;
  duration?: number;
  timezone?: string;
};

async function seed() {
  await db.account.deleteMany();
  await db.meeting.deleteMany();
  await db.user.deleteMany();
  const meetings = await getMeetings();
  await Promise.all(meetings.map((data) => db.meeting.create({ data })));
  await db.account.create({
    data: {
      name: "Online Intergroup of AA",
      url: "https://aa-intergroup.org/meetings",
      meetingCount: meetings.length,
      theme: "rose",
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
        let [day, time, ampm] = dayTime.split(" ");
        let [hours, minutes] = time.split(":").map((e) => Number(e));

        if (ampm === "PM") hours = hours + 12;
        time = [
          String(hours).padStart(2, "0"),
          String(minutes).padStart(2, "0"),
        ].join(":");

        meetings.push({
          name: row.name,
          slug: row.slug,
          day: config.days.indexOf(day.toLowerCase()),
          time,
          timezone: row.timezone,
        });
      });
  });

  return meetings;
}
