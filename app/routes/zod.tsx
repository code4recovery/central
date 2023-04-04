import {
  useField,
  useIsSubmitting,
  ValidatedForm,
  validationError,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ActionArgs, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { zfd } from "zod-form-data";

export const action = async ({ request }: ActionArgs) => {
  const { data, error } = await validator.validate(await request.formData());

  if (error) {
    return validationError(error);
  }

  const { firstName, lastName, email } = data;

  return json({ message: `great job ${firstName}` });
};

const fields = [
  {
    label: "First name",
    name: "firstName",
    type: "text",
    validation: zfd.text(z.string({ required_error: "Requis" })),
  },
  {
    label: "Last name",
    name: "lastName",
    type: "text",
    validation: zfd.text(z.string({ required_error: "Requis" })),
  },
  {
    label: "Year",
    name: "year",
    type: "number",
    validation: zfd.numeric(
      z
        .number()
        .gt(1500, "Year must be greater than 1500")
        .lt(2023, "Year must be less than 2023")
    ),
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    validation: zfd.text(
      z.string({ required_error: "Requis" }).email("Must be une email")
    ),
  },
];

export const validator = withZod(
  z.object(
    Object.fromEntries(fields.map(({ name, validation }) => [name, validation]))
  )
);

export default function Zod() {
  const actionData = useActionData();
  return (
    <ValidatedForm validator={validator} method="post">
      {fields.map((field, key) => (
        <FormInput {...{ ...field, key }} />
      ))}
      <SubmitButton />
      {actionData && <div>{actionData.message}</div>}
    </ValidatedForm>
  );
}

export const FormInput = ({
  name,
  type,
  label,
}: {
  name: string;
  type: string;
  label: string;
}) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input type={type} {...getInputProps({ id: name })} />
      {error && <span className="my-error-class">{error}</span>}
    </div>
  );
};

export const SubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};
