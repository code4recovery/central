import { DateTime } from "luxon";
import { useTranslation } from "~/hooks";

export function formatDayTime(
  day: number | null,
  time: string | null,
  timezone: string | null,
) {
  const strings = useTranslation();

  if (day === null || !time || !timezone) {
    return strings.meetings.ongoing;
  }

  const weekday = day === 0 ? 7 : day;
  const [hour, minute] = time
    .split(":")
    .map((s) => Number(s))
    .filter((e) => !isNaN(e));

  const start = DateTime.fromObject(
    { weekday, hour, minute },
    { zone: timezone, locale: `${strings.language}-us` },
  );

  return start.toLocaleString({
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
