import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { config } from "~/helpers";
import { strings } from "~/i18n";
import styles from "./tailwind.css";
import { getUserSession } from "~/utils";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: strings.app_name,
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const insecureRoutes = ["/"];
  const url = new URL(request.url);

  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (insecureRoutes.includes(url.pathname)) {
    if (userId && typeof userId === "string") {
      throw redirect(config.home);
    }
  } else {
    if (!userId || typeof userId !== "string") {
      const searchParams = new URLSearchParams([["redirectTo", url.pathname]]);
      throw redirect(`/?${searchParams}`);
    }
  }
  return null;
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-200 flex flex-col h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
