import type { Meeting } from "@prisma/client";
import { formatDateDiff } from "./format-date-diff";
import { formatDayTime } from "~/helpers";

export function formatMeetings(meetings: Meeting[]) {
  return meetings.map((meeting) => ({
    ...meeting,
    link: `/meetings/${meeting.id}`,
    updatedAt: formatDateDiff(meeting.updatedAt),
    when: formatDayTime(meeting.day, meeting.time, meeting.timezone),
  }));
}
