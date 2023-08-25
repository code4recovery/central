export function formatUrl(slug: string) {
  const accountUrl = process.env.ACCOUNT_URL || "";
  if (!accountUrl) return slug;
  return `${accountUrl}${accountUrl.endsWith("/") ? "" : "/"}${slug}`;
}
