import { config } from "./config";

export function validConferenceProvider(url: string): url is string {
  if (!url) return false;
  try {
    const { host } = new URL(url);
    return Object.keys(config.conference_providers).some((domain) =>
      host.endsWith(domain)
    );
  } catch {
    return false;
  }
}

export function validConferenceUrl(url: string): url is string {
  if (!url) return false;
  if (!validConferenceProvider(url)) return false;
  try {
    const { pathname } = new URL(url);
    return pathname.length > 4;
  } catch {
    return false;
  }
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

export function validUrl(url: string): url is string {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
