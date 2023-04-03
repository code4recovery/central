import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Alerts, Form, Template } from "~/components";
import { formatToken, validFormData } from "~/helpers";
import { userFields } from "~/fields";
import { strings } from "~/i18n";
import { db, sendMail } from "~/utils";
import md5 from "blueimp-md5";
import { useUser } from "~/hooks";
import { useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
  const { currentAccountID, email, name } = await validFormData(
    request,
    userFields()
  );
  const emailHash = md5(email);
  const loginToken = formatToken();
  console.log(currentAccountID);
  await db.user.create({
    data: {
      name,
      email,
      emailHash,
      loginToken,
      currentAccountID,
      accounts: { connect: { id: currentAccountID } },
    },
  });
  await sendMail(
    email,
    "invite",
    request,
    `/auth/${emailHash}/${loginToken}`,
    currentAccountID
  );
  return json({ success: strings.users.added });
};

export default function User() {
  const { currentAccountID } = useUser();
  const actionData = useActionData();
  return (
    <Template
      title={strings.users.add}
      breadcrumbs={[["/users", strings.users.title]]}
    >
      {actionData && <Alerts data={actionData} />}
      <Form
        title={strings.users.title}
        description={strings.users.description}
        fields={userFields({ currentAccountID })}
      />
    </Template>
  );
}
