import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Account } from "@prisma/client";

import styles from "./tailwind.css";
import { config } from "./helpers";
import { UserContext } from "./hooks";
import { strings } from "~/i18n";
import { getUserOrRedirect } from "~/utils";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: strings.app_name,
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const user = await getUserOrRedirect(request);
  return json({ user });
}

export default function App() {
  const { user } = useLoaderData();
  const {
    meetingCount,
    name: accountName,
    theme: themeName,
    url: accountUrl,
  } = user.accounts.find(({ id }: Account) => id === user.currentAccountID);
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-200 flex flex-col h-full">
        <UserContext.Provider
          value={{
            ...user,
            accountName,
            accountUrl,
            meetingCount,
            theme: config.themes[themeName as keyof typeof config.themes],
            themeName,
          }}
        >
          <Outlet />
        </UserContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
