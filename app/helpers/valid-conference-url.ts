import { config } from "./config";

export function validConferenceUrl(url: string) {
  if (!url) return false;
  const { host } = new URL(url);
  return Object.keys(config.conference_providers).filter((domain) =>
    host.endsWith(domain)
  ).length;
}
