import { AddressType, Client } from "@googlemaps/google-maps-services-js";
import { db } from "./db.server";

export async function geocode(query: string) {
  const result = await db.geoquery.findUnique({
    select: {
      geocode: {
        select: {
          id: true,
          formatted_address: true,
          latitude: true,
          location_type: true,
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
    return { ...result.geocode, status: "cache" };
  }

  const key = process.env.GOOGLE_API_KEY ?? "";

  const client = new Client({});

  let geocode;

  try {
    const response = await client.geocode({ params: { address: query, key } });

    if (!response.data.results.length) {
      return { status: "no_results" };
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
    return { status: "error", message };
  }

  const { formatted_address, latitude, location_type, longitude, timezone } =
    geocode;

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

  return {
    id: geoquery.geocodeID,
    formatted_address,
    latitude,
    location_type,
    longitude,
    timezone,
    status: "geocode",
  };
}
