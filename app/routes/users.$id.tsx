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
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/users"); // todo flash invalid id message to this page
  }
  const validator = formatValidator("user");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  const { name, email, admin, currentAccountID } = data;

  await db.user.update({
    where: { id },
    data: {
      name,
      email,
      adminAccounts: admin
        ? { connect: { id: currentAccountID } }
        : { disconnect: { id: currentAccountID } },
    },
  });
  return json({ success: strings.users.updated });
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  if (!validObjectId(id)) {
    return redirect("/users"); // todo flash invalid id message to this page
  }
  const user = await db.user.findFirst({ where: { id } });
  return json(user);
};

export default function User() {
  const loaderData = useLoaderData();
  const { state } = useNavigation();
  const actionData = useActionData();
  const submitting = state !== "idle";
  const { currentAccountID, isAdmin } = useUser();
  return (
    <Template
      title={isAdmin ? strings.users.edit : strings.users.edit_profile}
      breadcrumbs={isAdmin ? [["/users", strings.users.title]] : undefined}
    >
      {!submitting && actionData && <Alerts data={actionData} />}
      <Form
        title={strings.users.title}
        description={strings.users.description}
        isAdmin={isAdmin}
        form="user"
        values={{
          ...loaderData,
          admin: loaderData.adminAccountIDs.includes(currentAccountID),
        }}
      />
    </Template>
  );
}
