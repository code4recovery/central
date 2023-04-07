import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Form, Template } from "~/components";
import { formatValidator, validObjectId } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const action: ActionFunction = async ({ params, request }) => {
  if (!validObjectId(params.id)) {
    return redirect("/accounts"); // todo flash invalid id message to this page
  }
  const validator = formatValidator("account");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  const { name, url, theme } = data;

  await db.account.update({
    where: { id: params.id },
    data: {
      name,
      url,
      theme,
    },
  });

  return json({ success: strings.account.updated });
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!validObjectId(params.id)) {
    return redirect("/accounts"); // todo flash invalid id message to this page
  }

  const account = await db.account.findFirst({
    where: { id: params.id },
  });
  return json(account);
};

export const meta: MetaFunction = () => ({
  title: strings.account.title,
});

export default function Settings() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const { state } = useNavigation();
  return (
    <Template title={strings.account.title}>
      {actionData && state === "idle" && <Alerts data={actionData} />}
      <Form
        title={strings.account.title}
        description={strings.account.description}
        form="account"
        values={loaderData}
      />
    </Template>
  );
}
