import type { Geocode, Group, Meeting } from "@prisma/client";

import { config } from "~/helpers";

export function formatJson(
  meetings: Array<
    Partial<Meeting> & {
      languages: { code: string }[];
      types: { code: string }[];
      geocode: Partial<Geocode> | null;
      group: Partial<Group>;
    }
  >,
  accountUrl: string,
) {
  const url = (path: string) =>
    `${process.env.BASE_URL ?? "https://central.aa-intergroup.org"}${path}`;

  const websiteBaseUrl = accountUrl.includes("redirectTo=")
    ? decodeURIComponent(
        accountUrl.substring(accountUrl.indexOf("redirectTo=") + 11),
      )
    : accountUrl;

  return meetings
    .map(
      ({
        slug,
        id,
        name,
        timezone,
        notes,
        languages,
        types,
        day,
        time,
        conference_url,
        conference_url_notes,
        conference_phone,
        conference_phone_notes,
        location,
        updatedAt,
        geocode,
        group,
      }) => ({
        slug,
        name,
        timezone,
        notes,
        types: [
          ...languages
            .map(({ code }) => code)
            .map((code) =>
              code in config.languageSubstitutions
                ? config.languageSubstitutions[
                    code as keyof typeof config.languageSubstitutions
                  ]
                : code,
            ),
          ...types.map(({ code }) => code),
        ],
        day,
        time,
        conference_url,
        conference_url_notes,
        conference_phone,
        conference_phone_notes,
        location: location ?? group.name,
        formatted_address: geocode?.formatted_address,
        latitude: geocode?.latitude,
        longitude: geocode?.longitude,
        regions: [
          geocode?.country,
          geocode?.state,
          geocode?.county,
          geocode?.city,
          geocode?.neighborhood,
        ].filter(Boolean),
        group: group.name,
        group_id: group.recordID,
        group_notes: group.notes,
        email: group.email,
        phone: group.phone,
        website: group.website,
        venmo: group.venmo,
        paypal: group.paypal,
        square: group.square,
        edit_url: url(`/meetings/${id}`),
        // feedback_url: url(`/request/${group.recordID}/${slug}`),
        url: slug ? `${websiteBaseUrl}${slug}` : undefined,
        updated: updatedAt
          ?.toISOString()
          .split("T")
          .join(" ")
          .split("Z")
          .join(""), // todo use group/meeting created/updated whichever is latest
      }),
    )
    .map((entry) =>
      Object.entries(entry)
        .filter(([_, v]) => v !== null && v !== "") // remove null / empty values
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
    );
}
