import { PrismaClient } from "@prisma/client";
import md5 from "blueimp-md5";

import { strings } from "~/i18n";
import type { JSONData } from "~/types";
import { log } from "~/utils";
import { getOiaaData } from "./get-oiaa-data";
import { groupify } from "./groupify";

seed();

async function seed() {
  // check for required variables
  if (
    !process.env.SEED_SRC ||
    !process.env.SEED_USER_NAME ||
    !process.env.SEED_USER_EMAIL ||
    !process.env.SEED_ACCOUNT_NAME ||
    !process.env.SEED_ACCOUNT_URL
  ) {
    log("ERROR: seed vars missing");
    return;
  }

  const start = Date.now();
  const db = new PrismaClient();

  let meetings = process.env.SEED_SRC.startsWith(
    "https://docs.google.com/spreadsheets/d/"
  )
    ? await getOiaaData(process.env.SEED_SRC)
    : ((await (await fetch(process.env.SEED_SRC)).json()) as JSONData[]);

  if (!meetings.length) {
    log("ERROR: could not fetch data");
    return;
  }

  meetings = meetings.slice(0, 200);

  // create account if it doesnt exist yet
  let account = await db.account.findFirst({
    where: {
      name: process.env.SEED_ACCOUNT_NAME,
      url: process.env.SEED_ACCOUNT_URL,
    },
  });
  if (!account) {
    account = await db.account.create({
      data: {
        name: process.env.SEED_ACCOUNT_NAME,
        url: process.env.SEED_ACCOUNT_URL,
        theme: "sky",
      },
    });
  }

  // delete all groups in account (cascades to activity, change, meeting)
  await db.group.deleteMany({ where: { accountID: account.id } });
  await db.user.deleteMany({ where: { accounts: { none: {} } } });

  // create user if it doesnt exist yet
  const user = await db.user.findUnique({
    where: { email: process.env.SEED_USER_EMAIL },
  });
  if (user) {
    await db.user.update({
      data: {
        accounts: { connect: { id: account.id } },
      },
      where: {
        id: user.id,
      },
    });
  } else {
    await db.user.create({
      data: {
        name: process.env.SEED_USER_NAME,
        email: process.env.SEED_USER_EMAIL,
        emailHash: md5(process.env.SEED_USER_EMAIL),
        accounts: { connect: { id: account.id } },
        adminAccounts: { connect: { id: account.id } },
        currentAccountID: account.id,
      },
    });
  }

  const groups = await groupify(meetings, account.id);

  for (const group of groups) {
    await db.group.create({
      data: {
        ...group,
        account: { connect: { id: account.id } },
        meetings: {
          create: group.meetings.map((meeting) => ({
            ...meeting,
            account: { connect: { id: account!.id } },
            geocode: meeting.geocode
              ? { connect: { id: meeting.geocode } }
              : undefined,
            languages: {
              connectOrCreate: meeting.types
                ?.filter((code) => code in strings.languages)
                .map((code) => ({ where: { code }, create: { code } })),
            },
            types: {
              connectOrCreate: meeting.types
                ?.filter((code) => code in strings.types)
                .map((code) => ({ where: { code }, create: { code } })),
            },
          })),
        },
        users: {
          connectOrCreate: group.users?.map((user) => ({
            where: { email: user.email },
            create: {
              ...user,
              emailHash: md5(user.email),
            },
          })),
        },
      },
    });
  }

  const seconds = Math.round((Date.now() - start) / 1000);

  log(`${meetings.length} meetings imported in ${seconds} seconds`);
}
