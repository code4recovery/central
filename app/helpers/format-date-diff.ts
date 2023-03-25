import { strings } from "~/i18n";
import { formatString } from "./format-string";

export function formatDateDiff(date: Date) {
  const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (minutes < 2) {
    return strings.time.just_now;
  }
  if (minutes < 60) {
    return formatString(strings.time.minutes_ago, { minutes });
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 2) {
    return strings.time.hour_ago;
  }
  if (hours < 24) {
    return formatString(strings.time.hours_ago, { hours });
  }
  return date.toLocaleDateString();
}
