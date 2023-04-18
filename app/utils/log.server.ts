export function log(content: string | object) {
  const message =
    typeof content === "object" ? JSON.stringify(content) : content;
  console.log(`\x1b[33m${message}\x1b[0m`);
}
