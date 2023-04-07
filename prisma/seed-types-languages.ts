import { PrismaClient } from "@prisma/client";
import { strings } from "~/i18n";

const db = new PrismaClient();

async function seedTypesLanguages() {
  await db.change.deleteMany();
  await db.activity.deleteMany();
  await db.meeting.deleteMany();
  await db.type.deleteMany();
  await db.language.deleteMany();

  for (const code of Object.keys(strings.types)) {
    await db.type.create({ data: { code } });
    console.log(`added type ${code}`);
  }

  for (const code of Object.keys(strings.languages)) {
    await db.language.create({ data: { code } });
    console.log(`added language ${code}`);
  }
}

seedTypesLanguages();
