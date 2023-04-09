import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { User } from "@prisma/client";

import { config } from "~/helpers";
import { db } from "./db.server";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
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
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUser(request: Request): Promise<User> {
  const id = await getUserID(request);
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    throw unauthorized(request);
  }
  return user;
}

export async function getUserID(request: Request) {
  const session = await getUserSession(request);
  return session.get("userId");
}

export async function getUserOrRedirect(request: Request) {
  const { pathname } = new URL(request.url);

  const routeIsSecure = pathname !== "/" && !pathname.startsWith("/auth");
  const routeIsStatic = pathname.endsWith(".svg");

  if (routeIsStatic) {
    return;
  }

  const id = await getUserID(request);

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
    theme: config.themes[theme as keyof typeof config.themes],
  };
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

function unauthorized(request: Request) {
  const { pathname } = new URL(request.url);
  const searchParams = new URLSearchParams({ go: pathname });
  return redirect(`/?${searchParams}`);
}
