import type { Meeting } from "@prisma/client";
import { formatDateDiff } from "./format-date-diff";

export function formatMeetings(meetings: Meeting[]) {
  return meetings.map((meeting) => ({
    ...meeting,
    link: `/meetings/${meeting.id}`,
    updated: formatDateDiff(meeting.updatedAt ?? meeting.createdAt),
    start: meeting.start
      ? meeting.start.toLocaleTimeString("en-us", {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
          timeZone: meeting.timezone || undefined,
        })
      : "Ongoing",
  }));
}
