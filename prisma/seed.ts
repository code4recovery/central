import { PrismaClient } from "@prisma/client";
import md5 from "blueimp-md5";
import { DateTime } from "luxon";

import { getGoogleSheet, validConferenceUrl } from "~/helpers";
import { strings } from "~/i18n";
import { log } from "~/utils";

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
  languages?: { where: { code: string }; create: { code: string } }[];
  types?: { where: { code: string }; create: { code: string } }[];

  // group info
  recordID: string;
  phone?: string;
  email?: string;
  website?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  alt_contact_name?: string;
  alt_contact_email?: string;
};

async function seed() {
  const start = Date.now();

  const name = process.env.USER_NAME;
  const email = process.env.USER_EMAIL;
  const url = "https://aa-intergroup.org/meetings";

  if (!name || !email) {
    console.error("USER_NAME or USER_EMAIL vars missing");
    return;
  }

  const meetings = await getMeetings();

  await db.change.deleteMany();
  await db.activity.deleteMany();
  await db.meeting.deleteMany();
  await db.group.deleteMany();
  //await db.language.deleteMany();
  //await db.type.deleteMany();
  await db.user.deleteMany({ where: { NOT: { email } } });
  await db.account.deleteMany({ where: { NOT: { url } } });

  let account = await db.account.findFirst({
    where: { url },
  });
  if (!account) {
    account = await db.account.create({
      data: {
        name: "Online Intergroup of AA",
        url,
        theme: "sky",
      },
    });
  }

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    await db.user.create({
      data: {
        name,
        email,
        emailHash: md5(email),
        accounts: { connect: { id: account.id } },
        adminAccounts: { connect: { id: account.id } },
        currentAccountID: account.id,
      },
    });
  }

  for (const data of meetings) {
    const {
      recordID,
      notes,
      phone,
      email,
      primary_contact_name,
      primary_contact_email,
      alt_contact_name,
      alt_contact_email,
      languages,
      types,
      website,
      ...meetingInfo
    } = data;

    const users = [];
    if (primary_contact_email) {
      users.push({
        currentAccountID: account.id,
        email: primary_contact_email,
        emailHash: md5(primary_contact_email),
        name: primary_contact_name || primary_contact_email.split("@")[0],
      });
    }
    if (alt_contact_email && alt_contact_email !== primary_contact_email) {
      users.push({
        currentAccountID: account.id,
        email: alt_contact_email,
        emailHash: md5(alt_contact_email),
        name: alt_contact_name || alt_contact_email.split("@")[0],
      });
    }

    await db.meeting.create({
      data: {
        ...meetingInfo,
        account: { connect: { id: account.id } },
        archived: false,
        languages: {
          connectOrCreate: languages,
        },
        types: {
          connectOrCreate: types,
        },
        group: {
          connectOrCreate: {
            where: {
              accountID_name_recordID: {
                accountID: account.id,
                name: data.name,
                recordID,
              },
            },
            create: {
              name: data.name,
              notes,
              account: { connect: { id: account.id } },
              recordID,
              phone,
              email,
              website,
              users: {
                connectOrCreate: users.map((user) => ({
                  where: {
                    email: user.email,
                  },
                  create: user,
                })),
              },
            },
          },
        },
      },
    });
  }

  const seconds = Math.round((Date.now() - start) / 1000);

  log(`${meetings.length} meetings imported in ${seconds} seconds`);

  if (typesNotFound.length) {
    log({ typesNotFound });
  }

  if (languagesNotFound.length) {
    log({ languagesNotFound });
  }
}

seed();

async function getMeetings(): Promise<Meeting[]> {
  // fetch sheet
  const rows = await getGoogleSheet(
    "1tYV4wBZkY_3hp0tresN6iZBCwOyqkK-dz4UAWQPI1Vs"
  );
  const meetings: Meeting[] = [];

  rows.slice(150, 170).forEach((row) => {
    const urlIsValid = validConferenceUrl(row.url);

    const meeting = {
      name: row.name,
      timezone: row.timezone,
      notes: row.notes,
      types: connectTypes(row.types),
      languages: connectLanguages(row.languages, row.types),
      conference_url: urlIsValid ? row.url : undefined,
      conference_url_notes: row.access_code,

      // group info
      recordID: row.meeting_id,
      phone: row.phone,
      email: row.email,
      website: !urlIsValid ? row.url : undefined,
      primary_contact_name: row.primary_contact_name,
      primary_contact_email: row.primary_contact_email,
      alt_contact_name: row.alt_contact_name,
      alt_contact_email: row.alt_email, // yes
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
          return undefined;
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
          return undefined;
        })
        .filter((e) => typeof e !== "undefined"),
    ]),
  ];
  if (!normalized.length) normalized = ["EN"];
  return normalized.map((code) => ({
    where: { code: code as string },
    create: { code: code as string },
  }));
};

const connectTypes = (types: string) => {
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
          return undefined;
        })
        .filter((e) => typeof e !== "undefined")
        .sort()
    ),
  ];
  return normalized.length
    ? normalized.map((code) => ({
        where: { code: code as string },
        create: { code: code as string },
      }))
    : undefined;
};
