export function classNames(
  ...classes: Array<string | undefined | Record<string, boolean>>
) {
  return classes.filter(Boolean).join(" ");
}
