import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { AddressType, Client } from "@googlemaps/google-maps-services-js";
import { db, getIDs } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();

  const query = data.get("query")?.toString() ?? "";

  if (!query.length) {
    throw new Error("empty geocoding request");
  }

  const result = await db.geoquery.findUnique({
    select: {
      geocode: {
        select: {
          id: true,
          formatted_address: true,
          latitude: true,
          longitude: true,
          timezone: true,
        },
      },
    },
    where: {
      query,
    },
  });

  if (result) {
    return json({ ...result.geocode, status: "cache" });
  }

  const key = process.env.GOOGLE_MAPS_API_KEY ?? "";

  const client = new Client({});

  let geocode;

  try {
    const response = await client.geocode({ params: { address: query, key } });

    if (!response.data.results.length) {
      return json({ status: "no_results" });
    }

    const {
      address_components,
      formatted_address,
      geometry: { bounds, location, location_type },
      place_id,
      plus_code,
      types,
    } = response.data.results[0];

    const neighborhood = address_components.filter(({ types }) =>
      types.includes(AddressType.neighborhood)
    )[0]?.short_name;

    const cityTypes = [
      AddressType.locality,
      AddressType.postal_town,
      AddressType.administrative_area_level_3,
    ];
    const city = address_components.filter(({ types }) =>
      cityTypes.some((type) => types.includes(type))
    )[0]?.long_name;

    const state = address_components.filter(({ types }) =>
      types.includes(AddressType.administrative_area_level_1)
    )[0]?.long_name;

    const country = address_components.filter(({ types }) =>
      types.includes(AddressType.administrative_area_level_1)
    )[0]?.long_name;

    const timestamp = new Date();

    const result = await client.timezone({
      params: { location, timestamp, key },
    });

    geocode = {
      neighborhood,
      city,
      state,
      country,
      formatted_address,
      latitude: location.lat,
      longitude: location.lng,
      north: bounds?.northeast.lat,
      east: bounds?.northeast.lng,
      south: bounds?.southwest.lat,
      west: bounds?.southwest.lng,
      location_type,
      place_id,
      plus_code: plus_code?.global_code.toString(),
      timezone: result.data?.timeZoneId,
      types: types.join(),
      response: JSON.stringify(response.data.results[0]),
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return json({ status: "error", message });
  }

  const { formatted_address, latitude, longitude, timezone } = geocode;

  const geoquery = await db.geoquery.create({
    data: {
      query,
      geocode: {
        connectOrCreate: {
          create: geocode,
          where: { formatted_address },
        },
      },
    },
  });

  return json({
    id: geoquery.geocodeID,
    formatted_address,
    latitude,
    longitude,
    timezone,
    status: "geocode",
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const { currentAccountID } = await getIDs(request);
  const addresses = await db.geocode.findMany({
    select: {
      id: true,
      formatted_address: true,
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
