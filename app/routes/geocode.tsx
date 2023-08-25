import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db, geocode, getIDs } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const query = data.get("query")?.toString() ?? "";

  if (!query.length) {
    throw new Error("empty geocoding request");
  }

  return json(await geocode(query));
};

export const loader: LoaderFunction = async ({ request }) => {
  // secret geocode mode
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  if (query) {
    return json(await geocode(query));
  }

  const { currentAccountID } = await getIDs(request);
  const addresses = await db.geocode.findMany({
    select: {
      id: true,
      formatted_address: true,
      location_type: true,
      timezone: true,
    },
    where: {
      meetings: {
        some: {
          group: {
            accountID: currentAccountID,
          },
        },
      },
    },
  });
  return json(addresses);
};
