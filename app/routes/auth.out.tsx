import type { LoaderFunction } from "@remix-run/node";

import { logout } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const go = url.searchParams.get("go") || undefined;
  return logout(request, go);
};
