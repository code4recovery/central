import type { Field } from "~/types";

const arrayEquals = (array1: string[], array2: string[]) =>
  array1.length === array2.length &&
  array1.every((value) => array2.includes(value));

export function formatChanges(
  fields: { [index: string]: Field },
  value: { [key: string]: any },
  data: { [key: string]: any }
) {
  // get changed fields
  return Object.keys(fields)
    .map((field) => ({
      field,
      type: fields[field as keyof typeof fields].type,
      before: value[field as keyof typeof value],
      after: data[field],
    }))
    .filter(({ type, before, after }) =>
      type === "checkboxes"
        ? !arrayEquals(before as string[], after as string[])
        : before !== after
    )
    .filter(({ before, after }) => before || after);
}
