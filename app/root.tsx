import { useState } from "react";
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

import styles from "./tailwind.css";
import { GeocodeContext, UserContext } from "./hooks";
import { strings } from "~/i18n";
import type { Geocode } from "./types";
import { getUserOrRedirect } from "~/utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "icon", href: "/logo.svg", type: "image/svg+xml" },
  { rel: "mask-icon", href: "/logo.svg", color: "#312e81" },
];

export async function loader({ request }: LoaderArgs) {
  const user = await getUserOrRedirect(request);
  return json({ user });
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: strings.app_name,
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const { user } = useLoaderData();
  const [geocode, setGeocode] = useState<Geocode>({});
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 flex flex-col h-full">
        <GeocodeContext.Provider value={{ geocode, setGeocode }}>
          <UserContext.Provider value={user}>
            <Outlet />
          </UserContext.Provider>
        </GeocodeContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
