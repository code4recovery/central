import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import type { Account } from "@prisma/client";

import { config, formatString } from "~/helpers";
import { strings } from "~/i18n";
import type { Alert as AlertType } from "~/types";
import { db } from "./db.server";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    name: "session",
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function changeAccount(request: Request, account: Account) {
  const session = await getSession(request);
  session.set("currentAccountID", account.id);
  session.flash(
    "success",
    formatString(strings.account.switched, { name: account.name })
  );
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function createUserSession({
  id,
  currentAccountID,
  go,
}: {
  id: string;
  currentAccountID: string;
  go?: string;
}) {
  const session = await storage.getSession();
  session.set("id", id);
  session.set("currentAccountID", currentAccountID);
  return redirect(go ?? config.home, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getIDs(request: Request) {
  const session = await getSession(request);
  return {
    accountID: session.get("currentAccountID") as string,
    userID: session.get("id") as string,
  };
}

export async function getSession(request: Request) {
  return await storage.getSession(request.headers.get("Cookie"));
}

export async function getUserOrRedirect(request: Request) {
  const { pathname } = new URL(request.url);

  // return default user if it's a static route (doesn't need to be authenticated)
  if (pathname.endsWith(".svg")) {
    return {
      theme: config.themes[config.defaultTheme as keyof typeof config.themes],
    };
  }

  // limited number of public routes on the site
  const routeIsLoggedOut = pathname === "/" || pathname.startsWith("/auth");

  // request form can be authenticated or not
  const routeIsPublic = pathname.startsWith("/request") || routeIsLoggedOut;

  // get user
  const { userID } = await getIDs(request);
  const user = userID
    ? await db.user.findFirst({
        select: {
          id: true,
          currentAccountID: true,
          adminAccountIDs: true,
          name: true,
          emailHash: true,
          accounts: {
            select: {
              id: true,
              name: true,
              theme: true,
              url: true,
            },
          },
        },
        where: { id: userID },
      })
    : undefined;

  if (user) {
    const canLogIn = user.accounts.some(
      (account) => account.id === user.currentAccountID
    );

    if (routeIsLoggedOut) {
      throw redirect(canLogIn ? config.home : "/request");
    } else if (!routeIsPublic && !canLogIn) {
      throw unauthorized(request);
    }

    await db.user.update({
      data: { lastSeen: new Date() },
      where: { id: userID },
    });
  } else if (!routeIsPublic) {
    throw unauthorized(request);
  }

  const account = user?.accounts.find(({ id }) => id === user.currentAccountID);

  const isAdmin = user?.adminAccountIDs.includes(user.currentAccountID);

  const theme = account?.theme ?? config.defaultTheme;

  return {
    ...user,
    isAdmin,
    accountUrl: account?.url,
    theme: config.themes[theme as keyof typeof config.themes],
  };
}

export async function jsonWith(request: Request, payload: object) {
  const session = await getSession(request);

  const info = session.get("info") as string;
  const error = session.get("error") as string;
  const warning = session.get("warning") as string;
  const success = session.get("success") as string;
  const alert =
    info || error || warning || success
      ? {
          info,
          error,
          warning,
          success,
        }
      : undefined;

  return json(
    { ...payload, alert },
    {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    }
  );
}

export async function logout(request: Request, go = "/") {
  const session = await getSession(request);
  return redirect(go, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function redirectWith(
  route: string,
  request: Request,
  payload: {
    [Property in keyof AlertType]: string;
  }
) {
  const session = await getSession(request);
  session.flash(Object.keys(payload)[0], Object.values(payload)[0]);
  return redirect(route, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function unauthorized(request: Request) {
  const { pathname } = new URL(request.url);
  const searchParams = new URLSearchParams({ go: pathname });
  return redirect(`/?${searchParams}`);
}
