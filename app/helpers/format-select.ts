import { fields } from "./fields";

export function formatSelect(model: keyof typeof fields) {
  return Object.fromEntries(
    Object.keys(fields[model]).map((field) => [
      field,
      fields[model][field].type === "checkboxes"
        ? { select: { code: true } }
        : true,
    ])
  );
}
