import { PrismaClient } from "@prisma/client";

import { saveFeedToStorage } from "~/utils";

publish();

// publish all account feeds
async function publish() {
  const db = new PrismaClient();
  const accounts = await db.account.findMany();
  for (const account of accounts) {
    saveFeedToStorage(account.id);
  }
}
