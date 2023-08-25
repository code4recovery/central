import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { config } from "~/helpers";
import { createUserSession, db } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { loginToken, emailHash } = params;

  const url = new URL(request.url);
  const go = url.searchParams.get("go") || undefined;

  const user = await db.user.findFirst({
    select: {
      id: true,
      currentAccountID: true,
    },
    where: {
      emailHash,
      loginToken,
    },
  });

  if (user) {
    await db.user.update({
      data: { lastSeen: new Date() },
      where: { id: user.id },
    });

    return await createUserSession(
      user.id,
      user.currentAccountID,
      go ?? config.home
    );
  }

  return redirect("/?msg=expired");
};
