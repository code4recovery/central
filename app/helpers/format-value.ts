export function formatValue(value: string | string[] | null) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : null;
  }
  return value ? value : null;
}
