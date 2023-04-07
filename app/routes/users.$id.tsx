import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Form, Template } from "~/components";
import { formatValidator, validObjectId } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const action: ActionFunction = async ({ params, request }) => {
  if (!validObjectId(params.id)) {
    return redirect("/users"); // todo flash invalid id message to this page
  }
  const validator = formatValidator("user");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  const { name, email } = data;
  await db.user.update({ where: { id: params.id }, data: { name, email } });
  return json({ success: strings.users.updated });
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!validObjectId(params.id)) {
    return redirect("/users"); // todo flash invalid id message to this page
  }
  const user = await db.user.findFirst({ where: { id: params.id } });
  return json(user);
};

export default function User() {
  const loaderData = useLoaderData();
  const { state } = useNavigation();
  const actionData = useActionData();
  const submitting = state !== "idle";
  return (
    <Template
      title={strings.users.edit}
      breadcrumbs={[["/users", strings.users.title]]}
    >
      {!submitting && actionData && <Alerts data={actionData} />}
      <Form
        title={strings.users.title}
        description={strings.users.description}
        form="user"
        values={loaderData}
      />
    </Template>
  );
}
