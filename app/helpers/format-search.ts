export function formatSearch(search: FormDataEntryValue | null) {
  return (
    search
      ?.toString()
      .split('"')
      .join("")
      .split(" ")
      .filter((e) => e)
      .map((e) => `"${e}"`)
      .join(" ") ?? ""
  );
}
