export function formatSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z 0-9]/gi, "")
    .split(" ")
    .filter((e) => e)
    .join("_");
}
