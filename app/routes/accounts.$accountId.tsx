import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";

import { Alerts, Form, Template } from "~/components";
import { accountFields } from "~/fields";
import { validFormData } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const { id, name, url, theme } = await validFormData(
    request,
    accountFields()
  );

  await db.account.update({
    where: { id },
    data: {
      name: name as string,
      url: url as string,
      theme: theme as string,
    },
  });

  return json({ success: strings.account.updated });
};

export const loader: LoaderFunction = async ({ params }) => {
  const account = await db.account.findFirst({
    where: { id: params.accountId },
  });
  return json(account);
};

export const meta: MetaFunction = () => ({
  title: strings.account.title,
});

export default function Settings() {
  const { id, name, url, theme } = useLoaderData();
  const actionData = useActionData();
  const { state } = useNavigation();
  return (
    <Template title={strings.account.title}>
      {actionData && state === "idle" && <Alerts data={actionData} />}
      <Form
        title={strings.account.title}
        description={strings.account.description}
        fields={accountFields({
          id,
          name,
          url,
          theme,
        })}
      />
    </Template>
  );
}
