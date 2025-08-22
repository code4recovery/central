import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Columns, Form, Template } from "~/components";
import { config, formatValidator, validObjectId } from "~/helpers";
import { useTranslation } from "~/hooks";
import { en } from "~/i18n";
import { db, getIDs, getStrings } from "~/utils";

export const action: ActionFunction = async ({ params, request }) => {
  if (!validObjectId(params.id)) {
    return redirect(config.home); // todo flash invalid id message to this page
  }

  const translation = await getStrings(request);

  // security
  const { userID } = await getIDs(request);
  const account = db.account.findFirst({
    where: { id: params.id, adminIDs: { has: userID } },
  });
  if (!account) {
    return redirect(config.home); // todo flash invalid id message to this page
  }

  const validator = formatValidator("account");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  const { name, url, language, theme } = data;

  await db.account.update({
    data: {
      language,
      name,
      url,
      theme,
    },
    where: { id: params.id },
  });

  return json({ success: translation.account.updated });
};

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!validObjectId(params.id)) {
    return redirect(config.home); // todo flash invalid id message to this page
  }

  const { userID } = await getIDs(request);
  const account = await db.account.findFirst({
    where: { id: params.id, adminIDs: { has: userID } },
  });
  if (!account) {
    return redirect(config.home); // todo flash invalid id message to this page
  }

  return json(account);
};

export const meta: MetaFunction = () => ({
  title: en.account.title,
});

export default function Settings() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const { state } = useNavigation();
  const strings = useTranslation();
  return (
    <Template title={strings.account.title}>
      <Columns
        primary={
          <>
            {actionData && state === "idle" && <Alerts data={actionData} />}
            <Form form="account" values={loaderData} />
          </>
        }
      >
        <p>{strings.account.description}</p>
      </Columns>
    </Template>
  );
}
