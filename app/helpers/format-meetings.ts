import type { Meeting } from "@prisma/client";
import { formatUpdated } from "./format-updated";
import { formatDayTime } from "~/helpers";

export function formatMeetings(meetings: Meeting[]) {
  return meetings.map((meeting) => ({
    ...meeting,
    link: `/meetings/${meeting.id}`,
    updatedAt: formatUpdated(meeting.updatedAt),
    when: formatDayTime(meeting.day, meeting.time, meeting.timezone),
  }));
}
