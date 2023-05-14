import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Columns, Form, Template } from "~/components";
import { formatValidator } from "~/helpers";
import { strings } from "~/i18n";
import { db, getIDs, redirectWith } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const { id, currentAccountID } = await getIDs(request);

  const validator = formatValidator("group", {
    validator: async (data) =>
      !(await db.group.count({
        where: { recordID: data.recordID, accountID: currentAccountID },
      })),
    params: {
      message: strings.group.recordExists,
      path: ["recordID"],
    },
  });

  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  const group = await db.group.create({
    data: {
      ...data,
      name: data.name, // todo why
      account: { connect: { id: currentAccountID } },
    },
  });
  await db.activity.create({
    data: {
      type: "create",
      groupID: group.id,
      userID: id,
    },
  });
  return redirectWith(`/groups/${group.id}`, request, {
    success: strings.group.added,
  });
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
