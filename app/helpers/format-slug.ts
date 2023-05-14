export function formatSlug(str: string, uniqueSlugs: string[] = []) {
  const base = str
    .toLowerCase()
    .replace(/[^a-z 0-9]/gi, "")
    .split(" ")
    .filter((e) => e)
    .join("-");

  if (!uniqueSlugs.includes(base)) {
    return base;
  }

  const trySlug = (i: number) => [base, i].join("-");

  let i = 1;
  while (uniqueSlugs.includes(trySlug(i))) {
    i++;
  }

  return trySlug(i);
}
