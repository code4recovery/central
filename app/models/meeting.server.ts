import { validObjectId } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export async function getMeeting(id?: string) {
  if (!validObjectId(id)) {
    throw new Response(null, {
      status: 404,
      statusText: strings.group.notFound,
    });
  }
  const meeting = await db.meeting.findUniqueOrThrow({
    where: { id },
    select: {
      slug: true,
      name: true,
      conference_url: true,
      conference_url_notes: true,
      conference_phone: true,
      conference_phone_notes: true,
      geocodeID: true,
      groupID: true,
      timezone: true,
      location: true,
      location_notes: true,
      day: true,
      time: true,
      duration: true,
      notes: true,
      archived: true,
      activity: {
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          createdAt: true,
          changes: {
            select: { field: true },
          },
          type: true,
          user: {
            select: {
              name: true,
              emailHash: true,
            },
          },
        },
        take: 5,
      },
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      languages: {
        select: { code: true },
      },
      types: {
        select: { code: true },
      },
    },
  });
  return {
    ...meeting,
    languages: meeting?.languages.map(({ code }) => code),
    types: meeting?.types.map(({ code }) => code),
  };
}

export async function getAllMeetingsForJson(accountID: string) {
  return await db.meeting.findMany({
    select: {
      slug: true,
      id: true,
      name: true,
      languages: { select: { code: true } },
      types: { select: { code: true } },
      timezone: true,
      notes: true,
      day: true,
      time: true,
      conference_url: true,
      conference_url_notes: true,
      conference_phone: true,
      conference_phone_notes: true,
      updatedAt: true,
      group: {
        select: {
          name: true,
          recordID: true,
          notes: true,
          email: true,
          phone: true,
          website: true,
          venmo: true,
          paypal: true,
          square: true,
          updatedAt: true,
        },
      },
    },
    where: {
      archived: false,
      group: {
        accountID,
      },
    },
  });
}
