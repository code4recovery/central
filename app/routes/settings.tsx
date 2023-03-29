import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { Alert, Form, Separator, Template } from "~/components";
import { userFields, accountFields } from "~/fields";
import { validFormData } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const meta: MetaFunction = () => ({
  title: strings.settings_title,
});

export const action: ActionFunction = async ({ request }) => {
  const { accountID, email, userID, name, url, theme } = await validFormData(
    request,
    [...userFields({}), ...accountFields({})]
  );

  if (accountID) {
    await db.account.update({
      where: { id: accountID as string },
      data: {
        name: name as string,
        url: url as string,
        theme: theme as string,
      },
    });

    return json({ success: "Account updated." });
  } else if (userID) {
    await db.user.update({
      where: { id: userID as string },
      data: {
        name: name as string,
        email: email as string,
      },
    });
    return json({ success: "User settings updated." });
  }
  return json({ info: "No update." });
};

export default function Settings() {
  const {
    accountName,
    accountUrl,
    currentAccountID,
    name,
    email,
    theme: { text },
    themeName,
    id: userID,
  } = useUser();
  const data = useActionData();
  return (
    <Template title={strings.settings_title}>
      {data?.info && <Alert type="info" message={data.info} />}
      {data?.success && <Alert type="success" message={data.success} />}
      <Form
        title={strings.settings_user_title}
        description={strings.settings_user_description}
        fields={userFields({ name, email, text, userID })}
      />
      <Separator />
      <Form
        title={strings.settings_account_title}
        description={strings.settings_account_description}
        fields={accountFields({
          currentAccountID,
          accountName,
          accountUrl,
          themeName,
          text,
        })}
      />
    </Template>
  );
}
