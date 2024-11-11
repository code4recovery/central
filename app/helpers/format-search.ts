export function formatSearch(search: FormDataEntryValue | null) {
  return (
    search
      ?.toString()
      .replace(/['"]+/g, "")
      .split(" ")
      .filter(Boolean)
      .map((e) => `"${e}"`)
      .join(" ") ?? ""
  );
}
