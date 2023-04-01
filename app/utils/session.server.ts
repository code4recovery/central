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
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function getUserOrRedirect(request: Request) {
  const { pathname } = new URL(request.url);

  const routeIsSecure = pathname !== "/" && !pathname.startsWith("/auth");
  const routeIsStatic = pathname.endsWith(".svg");

  if (routeIsStatic) {
    return;
  }

  const session = await getUserSession(request);
  const id = session.get("userId");

  const user = id
    ? await db.user.findFirst({
        where: { id },
        include: {
          accounts: true,
        },
      })
    : undefined;

  if (user) {
    await db.user.update({
      data: { lastSeen: new Date(), admin: true },
      where: { id },
    });
    if (!routeIsSecure) {
      throw redirect(config.home);
    }
  } else if (routeIsSecure) {
    const searchParams = new URLSearchParams({ go: pathname });
    throw redirect(`/?${searchParams}`);
  }

  const account = user?.accounts.find(
    ({ id }) => id === user?.currentAccountID
  );

  const theme = account?.theme ?? config.defaultTheme;

  return {
    ...user,
    accountID: account?.id ?? "",
    accountName: account?.name ?? "",
    accountUrl: account?.url ?? "",
    meetingCount: account?.meetingCount ?? 0,
    theme: config.themes[theme as keyof typeof config.themes],
    themeName: theme,
  };
}
