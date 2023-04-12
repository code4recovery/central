import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Columns, Form, Template } from "~/components";
import { formatValidator } from "~/helpers";
import { db } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const validator = formatValidator("group");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  const group = db.group.create({ data });
  return null;
};

export const loader: LoaderFunction = async () => {
  const {
    _max: { recordID },
  } = await db.group.aggregate({ _max: { recordID: true } });
  return json({ recordID: parseInt(recordID || "0") + 1 });
};

export default function AddGroup() {
  const loaderData = useLoaderData();
  return (
    <Template>
      <Columns primary={<Form form="group" values={loaderData} />}>
        Record ID is one higher than the current max.
      </Columns>
    </Template>
  );
}
