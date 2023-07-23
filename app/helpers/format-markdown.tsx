export function formatMarkdown(
  markdown = "",
  replacements: { [id: string]: string | number | undefined }
) {
  Object.keys(replacements).forEach((key) => {
    markdown = markdown.split(`{${key}}`).join(getString(replacements[key]));
  });

  const __html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/\r\n|\r|\n/gim, "<br>")
    .replace(/\[([^[]+)\](\(([^)]*))\)/gim, '<a href="$3">$1</a>');

  return <div className="markdown" dangerouslySetInnerHTML={{ __html }} />;
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
