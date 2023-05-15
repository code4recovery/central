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

export async function createUserSession(
  id: string,
  currentAccountID: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("id", id);
  session.set("currentAccountID", currentAccountID);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getIDs(request: Request) {
  const session = await getSession(request);
  return {
    id: session.get("id"),
    currentAccountID: session.get("currentAccountID"),
  };
}

export async function getSession(request: Request) {
  return await storage.getSession(request.headers.get("Cookie"));
}

export async function getUserOrRedirect(request: Request) {
  const { pathname } = new URL(request.url);

  // stop processing if it's the favicon
  const routeIsStatic = pathname.endsWith(".svg");
  if (routeIsStatic) {
    return;
  }

  // limited number of public routes on the site
  const routeIsPublic = pathname === "/" || pathname.startsWith("/auth");

  // get user
  const { id } = await getIDs(request);
  const user = id
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
        where: { id },
      })
    : undefined;

  if (user) {
    await db.user.update({
      data: { lastSeen: new Date() },
      where: { id },
    });
    if (routeIsPublic) {
      throw redirect(config.home);
    }
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

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
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
