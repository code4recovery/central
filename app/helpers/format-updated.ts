import { DateTime } from "luxon";

export function formatUpdated(date: Date) {
  const datetime = DateTime.fromJSDate(date).toLocal();

  const diff = datetime.diffNow(["days"]).toObject();

  if (!diff.days || diff.days < 1) {
    return datetime.toLocaleString(DateTime.TIME_SIMPLE);
  }

  if (diff.days < -6) {
    return datetime.toLocaleString(DateTime.DATE_FULL);
  }

  return datetime.toLocaleString({
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
