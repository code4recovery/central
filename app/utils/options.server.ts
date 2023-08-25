import { db } from "./db.server";

export async function optionsInUse() {
  const languages = await db.language.findMany({
    select: {
      code: true,
    },
  });

  const types = await db.type.findMany({
    select: {
      code: true,
    },
  });

  return {
    languages: languages.map(({ code }) => code),
    types: types.map(({ code }) => code),
  };
}
