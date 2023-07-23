export function formatString(
  str = "",
  replacements: { [id: string]: string | number | undefined }
) {
  Object.keys(replacements).forEach((key) => {
    str = str.split(`{${key}}`).join(getString(replacements[key]));
  });
  return str;
}

function getString(unk: string | number | undefined): string {
  switch (typeof unk) {
    case "undefined":
      return "";
    case "number":
      return unk.toLocaleString();
    default:
      return unk;
  }
}
