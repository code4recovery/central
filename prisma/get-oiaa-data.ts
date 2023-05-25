import { DateTime } from "luxon";
import { formatSlug, getGoogleSheet, validConferenceUrl } from "~/helpers";
import { strings } from "~/i18n";
import type { JSONData } from "~/types";

export async function getOiaaData(url: string) {
  // start up
  const data: JSONData[] = [];
  const rows = await getGoogleSheet(url.split("/")[5]);
  const typesLookup = Object.fromEntries(
    Object.entries({
      ...strings.types,
      ...strings.languages,
    }).map((a) => a.reverse())
  );
  const slugs: string[] = [];

  // loop through
  for (const row of rows) {
    const times = row.times
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e);
    if (!times.length) {
      times.push(""); // ongoing meeting
    }
    const isConferenceUrl = validConferenceUrl(row["url"]);
    const isConferencePhone = looksLikeConferencePhone(row["phone"]);
    for (const dayTime of times) {
      const slug = formatSlug(row["name"], slugs);
      slugs.push(slug);
      data.push({
        ...convertDayTime(dayTime, row.timezone),
        conference_url: isConferenceUrl ? row["url"] : undefined,
        conference_phone: isConferencePhone ? row["phone"] : undefined,
        contact_1_email: row["primary-contact-email"],
        contact_1_name: row["primary-contact-name"],
        contact_2_email: row["alt-email"],
        contact_2_name: row["alt-contact-name"],
        email: row["email"],
        group: row["name"],
        group_id: row["meeting-id"],
        name: row["name"],
        notes: row["notes"],
        slug,
        types: convertTypes(row.types, row.languages, typesLookup),
        phone: isConferencePhone ? undefined : row["phone"],
        website: isConferenceUrl ? undefined : row["url"],
      });
    }
  }
  return data;
}

// convert Sunday 8:00 PM, America/New_York to proper day, time, timezone
const convertDayTime = (dayTime: string, timezone: string) => {
  if (!dayTime) {
    return {}; // ongoing meeting
  }

  dayTime = dayTime
    .split(" ")
    .filter((e) => e)
    .join(" ");
  const start = DateTime.fromFormat(dayTime, "cccc h:mm a", {
    zone: timezone,
  });

  if (!start.isValid) {
    console.error(`invalid ${dayTime} ${timezone}: ${start.invalidReason}`);
    return {
      day: undefined,
      time: undefined,
      timezone: undefined,
    };
  }

  return {
    day: start.weekday === 7 ? 0 : start.weekday,
    time: start.toFormat("HH:mm"),
    timezone: start.toFormat("z"),
  };
};

// convert string types to codes
function convertTypes(
  types: string,
  languages: string,
  typesLookup: { [key: string]: string }
) {
  types = types.replace("Steps/Traditions", "Step Study, Tradition Study");
  const newTypes = [
    ...new Set(
      [types, languages]
        .join(",")
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e)
        .filter((e) => {
          if (e === "ASL") e = "American Sign Language";
          if (e === "BIPOC") e = "People of Color";
          if (e === "Deaf/Hard of Hearing") e = "Deaf / Hard of Hearing";
          if (e === "Farsi") e = "Persian";
          if (e === "Newcomers") e = "Newcomer";
          if (e in typesLookup) {
            return true;
          } else {
            console.log(`invalid type ${e}`);
            return false;
          }
        })
        .map((e) => typesLookup[e])
    ),
  ];

  return newTypes;
}

function looksLikeConferencePhone(str: string) {
  const zoomPhones = [
    "6465588656",
    "6469313860",
    "3017158592",
    "3052241968",
    "3092053325",
    "3126266799",
    "6892781000",
    "7193594580",
    "2532050468",
    "2532158782",
    "3462487799",
    "3602095623",
    "3863475053",
    "5074734847",
    "5642172000",
    "6694449171",
    "6699009128",
  ];

  const phone = str.replace(/\D/g, "");

  return zoomPhones.some((zoomPhone) => phone.includes(zoomPhone));
}
