import md5 from "blueimp-md5";
import type { ActionFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Columns, Form, Template } from "~/components";
import { formatString, formatToken, formatValidator } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, getIDs, redirectWith, sendMail } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const { accountID } = await getIDs(request);

  const validator = formatValidator("user", {
    validator: async (data) =>
      !(await db.user.count({
        where: { email: data.email, currentAccountID: accountID },
      })),
    params: {
      message: strings.users.exists,
      path: ["email"],
    },
  });
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }

  const { name, email } = data;
  const emailHash = md5(email);
  const loginToken = formatToken();

  if (await db.user.count({ where: { email } })) {
    // if user exists, add them to this account
    db.user.update({
      where: { email },
      data: { accounts: { connect: { id: accountID } } },
    });
  } else {
    // otherwise create
    await db.user.create({
      data: {
        name,
        email,
        emailHash,
        loginToken,
        currentAccountID: accountID,
        accounts: { connect: { id: accountID } },
      },
    });
  }

  const { name: accountName, url: accountUrl } =
    await db.account.findFirstOrThrow({
      where: { id: accountID },
    });

  // send invitation
  await sendMail({
    accountID,
    buttonLink: `/auth/${emailHash}/${loginToken}`,
    buttonText: strings.email.invite.buttonText,
    headline: formatString(strings.email.invite.headline, {
      accountUrl,
    }),
    instructions: strings.email.invite.instructions,
    request,
    subject: formatString(strings.email.invite.subject, {
      accountName,
    }),
    to: email,
  });

  return redirectWith("/users", request, {
    success: strings.users.added,
  });
};

export default function User() {
  const { currentAccountID, isAdmin } = useUser();
  const actionData = useActionData();
  return (
    <Template
      title={strings.users.add}
      breadcrumbs={[["/users", strings.users.title]]}
    >
      {actionData && <Alerts data={actionData} />}
      <Columns
        primary={
          <Form form="user" isAdmin={isAdmin} values={{ currentAccountID }} />
        }
      >
        <p>{strings.users.add_description}</p>
      </Columns>
    </Template>
  );
}
