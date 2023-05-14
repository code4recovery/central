export function formatUrl(accountUrl: string, slug: string) {
  return `${accountUrl}${accountUrl.endsWith("/") ? "" : "/"}${slug}`;
}
