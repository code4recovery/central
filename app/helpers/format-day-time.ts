import { DateTime } from "luxon";

import { strings } from "~/i18n";

export function formatDayTime(
  day: number | null,
  time: string | null,
  timezone: string | null
) {
  if (day === null || !time || !timezone) {
    return strings.ongoing;
  }

  const weekday = day === 0 ? 7 : day;
  const [hour, minute] = time
    .split(":")
    .map((s) => Number(s))
    .filter((e) => !isNaN(e));

  const start = DateTime.fromObject(
    { weekday, hour, minute },
    { zone: timezone }
  );

  return start.toLocaleString({
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
