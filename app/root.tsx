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

import { strings } from "~/i18n";
import styles from "./tailwind.css";
import { UserContext } from "./contexts";
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
  const { meetingCount, theme } = user.accounts.find(
    ({ id }: Account) => id === user.currentAccountID
  );
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
            meetingCount,
            theme,
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
