import { db } from "./db.server";

export async function optionsInUse(accountID: string) {
  const languages = await db.language.findMany({
    select: {
      code: true,
    },
    where: {
      meetings: {
        some: {
          accountID,
        },
      },
    },
  });

  const types = await db.type.findMany({
    select: {
      code: true,
    },
    where: {
      meetings: {
        some: {
          accountID,
        },
      },
    },
  });

  return {
    languages: languages.map(({ code }) => code),
    types: types.map(({ code }) => code),
  };
}
