export function formatValue(value: string | string[] | number | null) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : null;
  } else if (typeof value === "number") {
    return value.toString();
  }
  return value ? value : null;
}
