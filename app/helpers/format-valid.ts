import { config } from "./config";

export function validConferenceUrl(url: string): url is string {
  if (!url) return false;
  const { host } = new URL(url);
  return !!Object.keys(config.conference_providers).filter((domain) =>
    host.endsWith(domain)
  ).length;
}

export function validObjectId(objectID?: string): objectID is string {
  return !!objectID?.match(/^[0-9a-fA-F]{24}$/);
}

export function validPayPal(handle: string): handle is string {
  return !!handle.match(/^[a-z0-9]+$/i);
}

export function validPhone(phone: string): phone is string {
  return !!phone.match(/^[0-9-+(),#]*$/);
}
