import { createCookieSessionStorage, redirect } from "@remix-run/node";
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

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  console.log("logging out");
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function getUserOrRedirect(request: Request) {
  const url = new URL(request.url);

  const secure = !config.insecureRoutes.includes(url.pathname);

  const session = await getUserSession(request);
  const userId: string = session.get("userId");

  const user = await db.user.findFirst({
    where: { id: userId },
    include: {
      accounts: true,
    },
  });

  if (secure && !user) {
    const searchParams = new URLSearchParams({ go: url.pathname });
    throw redirect(`/?${searchParams}`);
  }

  if (!secure && user) {
    throw redirect(config.home);
  }

  return user;
}
