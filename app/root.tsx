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
import { useState } from "react";

import { Message, Template } from "~/components";
import { en } from "~/i18n";
import { getStrings, getUserOrRedirect } from "~/utils";
import {
  GeocodeContext,
  TranslationContext,
  UserContext,
  useTranslation,
} from "./hooks";
import styles from "./tailwind.css";
import type { Geocode } from "./types";

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
  const strings = await getStrings(request);
  return json({ user, strings });
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: en.app_name,
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const { user, strings } = useLoaderData();
  const [geocode, setGeocode] = useState<Geocode>({});
  return (
    <TranslationContext.Provider value={strings}>
      <html lang={strings.language} className="h-full">
        <head>
          <Meta />
          <Links />
        </head>
        <body className="flex h-full flex-col bg-neutral-200 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
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
    </TranslationContext.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const strings = useTranslation();
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
      <body className="flex h-full flex-col bg-neutral-200 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
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
