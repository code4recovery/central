import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";

import { Alerts, Form, Template } from "~/components";
import { userFields } from "~/fields";
import { validFormData, validObjectId } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const { id, name, email } = await validFormData(request, userFields());
  await db.user.update({ where: { id }, data: { name, email } });
  return json({ success: strings.users.updated });
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!validObjectId(params.userId)) {
    return redirect("/users");
  }
  const user = await db.user.findFirst({ where: { id: params.userId } });
  return json(user);
};

export default function User() {
  const { id, name, email } = useLoaderData();
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
        fields={userFields({ id, name, email })}
      />
    </Template>
  );
}
