import type { JSONData } from "~/types";
import { geocode } from "~/utils";

type Group = {
  email?: string;
  name: string;
  notes?: string;
  paypal?: string;
  phone?: string;
  recordID?: string;
  square?: string;
  venmo?: string;
  website?: string;
  meetings: {
    conference_url?: string;
    conference_url_notes?: string;
    conference_phone?: string;
    conference_phone_notes?: string;
    day?: number;
    geocode?: string | null;
    languages?: string[];
    name: string;
    notes?: string;
    slug: string;
    timezone?: string;
    time?: string;
    types?: string[];
  }[];
  users?: {
    currentAccountID: string;
    name: string;
    email: string;
  }[];
};

export async function groupify(meetings: JSONData[], currentAccountID: string) {
  const groups: Group[] = [];

  for (const entry of meetings) {
    const geo = entry.formatted_address
      ? await geocode(entry.formatted_address)
      : undefined;

    const meeting = {
      conference_phone: entry.conference_phone?.trim(),
      conference_phone_notes: entry.conference_phone_notes?.trim(),
      conference_url: entry.conference_url?.trim(),
      conference_url_notes: entry.conference_url_notes?.trim(),
      day: entry.day,
      duration: 60, // todo fix before there is an end time
      geocode: geo ? geo.id : undefined,
      location: entry.location?.trim(),
      name: entry.name?.trim(),
      notes: entry.notes?.trim(),
      slug: entry.slug?.trim(),
      time: entry.time?.trim(),
      timezone: entry.timezone?.trim(),
      types: entry.types,
    };

    // try to find group first by group name, then email/venmo, then meeting name
    const group = entry.group_id
      ? groups.find(({ recordID }) => recordID === entry.group_id)
      : entry.group
      ? groups.find(({ name }) => name === entry.group)
      : entry.email || entry.venmo
      ? groups.find(
          ({ email, venmo }) => email === entry.email || venmo === entry.venmo
        )
      : groups.find(({ name }) => name === entry.name);

    if (group) {
      if (!group.email) group.email = entry.email?.trim();
      if (!group.name) {
        group.name = entry.group ? entry.group : entry.name?.trim();
      }
      if (!group.notes) group.notes = entry.group_notes?.trim();
      if (!group.paypal) group.paypal = entry.paypal?.trim();
      if (!group.square) group.square = entry.square?.trim();
      if (!group.venmo) group.venmo = entry.venmo?.trim();
      if (!group.website) group.website = entry.website?.trim();
      group.meetings.push(meeting);
    } else {
      const users = [];
      if (entry.contact_1_email) {
        users.push({
          currentAccountID,
          email: entry.contact_1_email?.trim(),
          name: entry.contact_1_name ?? entry.contact_1_email.split("@")[0],
        });
      }
      if (entry.contact_2_email) {
        users.push({
          currentAccountID,
          email: entry.contact_2_email?.trim(),
          name: entry.contact_2_name ?? entry.contact_2_email.split("@")[0],
        });
      }
      groups.push({
        email: entry.email,
        meetings: [meeting],
        name: entry.group ? entry.group : entry.name,
        notes: entry.group_notes,
        paypal: entry.paypal,
        recordID: entry.group_id,
        square: entry.square,
        users,
        venmo: entry.venmo,
        website: entry.website,
      });
    }
  }

  return groups;
}
