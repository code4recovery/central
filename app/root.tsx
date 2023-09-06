import { useState } from "react";
import {
  json,
  type LinksFunction,
  type LoaderArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import styles from "./tailwind.css";
import { Message, Template } from "~/components";
import { GeocodeContext, UserContext } from "./hooks";
import { strings } from "~/i18n";
import type { Geocode } from "./types";
import { getUserOrRedirect } from "~/utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "icon",
    href: "https://code4recovery.org/wp-content/uploads/2023/09/central-logo.png",
    media: "(prefers-color-scheme: light)",
    type: "image/png",
  },
  {
    rel: "icon",
    href: "https://code4recovery.org/wp-content/uploads/2023/09/central-logo-white.png",
    media: "(prefers-color-scheme: dark)",
    type: "image/png",
  },
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

export function ErrorBoundary() {
  const error = useRouteError();
  const messageProps = isRouteErrorResponse(error)
    ? {
        heading: `${error.status}: ${error.statusText}`,
        text: error.data,
      }
    : error instanceof Error
    ? {
        heading: strings.error,
        text: error.message,
        data: error.stack,
      }
    : {
        heading: strings.error,
        text: strings.error_unknown,
      };
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-neutral-200 flex flex-col h-full dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <Template>
          <Message {...messageProps} />
        </Template>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
