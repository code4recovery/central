import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import type { User } from "@prisma/client";

import { config } from "~/helpers";
import type { Alert as AlertType } from "~/types";
import { db } from "./db.server";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "session",
      secure: process.env.NODE_ENV === "production",
      secrets: [process.env.SESSION_SECRET],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getUser(request: Request): Promise<User> {
  const session = await getSession(request.headers.get("Cookie"));
  const id = session.get("userId");
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    throw unauthorized(request);
  }
  return user;
}

export async function getUserOrRedirect(request: Request) {
  const { pathname } = new URL(request.url);

  const routeIsSecure = pathname !== "/" && !pathname.startsWith("/auth");
  const routeIsStatic = pathname.endsWith(".svg");

  if (routeIsStatic) {
    return;
  }

  const { id } = await getUser(request);

  const user = id
    ? await db.user.findFirst({
        where: { id },
        include: {
          accounts: true,
          adminAccounts: true,
        },
      })
    : undefined;

  if (user) {
    await db.user.update({
      data: { lastSeen: new Date() },
      where: { id },
    });
    if (!routeIsSecure) {
      throw redirect(config.home);
    }
  } else if (routeIsSecure) {
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
  const session = await getSession(request.headers.get("Cookie"));

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
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
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
  const session = await getSession(request.headers.get("Cookie"));
  session.flash(Object.keys(payload)[0], Object.values(payload)[0]);
  return redirect(route, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

function unauthorized(request: Request) {
  const { pathname } = new URL(request.url);
  const searchParams = new URLSearchParams({ go: pathname });
  return redirect(`/?${searchParams}`);
}
