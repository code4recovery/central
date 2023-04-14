import { DateTime } from "luxon";

export function formatDate(date?: string | null) {
  if (!date) return "";

  const now = DateTime.local();
  const datetime = DateTime.fromISO(date).toLocal();

  if (datetime.hasSame(now, "year") && datetime.hasSame(now, "week")) {
    if (datetime.hasSame(now, "day")) {
      // today, show time
      return datetime.toLocaleString(DateTime.TIME_SIMPLE);
    }

    // this week, show day and time
    return datetime.toLocaleString({
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // show date
  return datetime.toLocaleString(DateTime.DATE_FULL);
}
