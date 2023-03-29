import type { Field } from "~/types";

export async function validFormData(request: Request, fields: Field[]) {
  const formData = await request.formData();
  const data: { [key: string]: string } = {};
  const errors = [];

  fields.forEach(({ name, type = "hidden", required }) => {
    data[name] = formData.get(name)?.toString() ?? "";
    if (typeof data[name] !== "string") {
      errors.push(`${name} should be a string`);
    } else if (!data[name] && required) {
      errors.push(`${name} is required`);
    } else if (type === "email" && !data[name].includes("@")) {
      errors.push(`${name} should be an email`);
    }
  });

  return data;
}
