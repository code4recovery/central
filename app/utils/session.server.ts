import { createCookieSessionStorage, json, redirect } from "@remix-run/node";

import { config } from "~/helpers";
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

export async function createUserSession(id: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("id", id);
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
  };
}

export async function getSession(request: Request) {
  return await storage.getSession(request.headers.get("Cookie"));
}

export async function getUserOrRedirect(request: Request) {
  const { pathname } = new URL(request.url);

  // return default user if it's a public route
  if (pathname.endsWith(".svg") || pathname.startsWith("/request")) {
    return {};
  }

  // limited number of public routes on the site
  const routeIsOnlyForLoggedOut =
    pathname === "/" || pathname.startsWith("/auth");
  // get user
  const { id } = await getIDs(request);
  const user = id
    ? await db.user.findFirst({
        select: {
          id: true,
          name: true,
          emailHash: true,
          canAddGroups: true,
        },
        where: { id },
      })
    : undefined;

  if (user) {
    await db.user.update({
      data: { lastSeen: new Date() },
      where: { id },
    });
    if (routeIsOnlyForLoggedOut) {
      throw redirect(config.home);
    }
  } else if (!routeIsOnlyForLoggedOut) {
    throw unauthorized(request);
  }

  return user;
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
