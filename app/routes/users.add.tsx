import md5 from "blueimp-md5";
import type { ActionFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Columns, Form, Template } from "~/components";
import { formatString, formatToken, formatValidator } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, redirectWith, sendMail } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const validator = formatValidator("user", {
    validator: async (data) =>
      !(await db.user.count({
        where: { email: data.email },
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

  if (!(await db.user.count({ where: { email } }))) {
    await db.user.create({
      data: {
        name,
        email,
        emailHash,
        loginToken,
      },
    });
  }

  // send invitation
  await sendMail({
    buttonLink: `/auth/${emailHash}/${loginToken}`,
    buttonText: strings.email.invite.buttonText,
    headline: formatString(strings.email.invite.headline, {
      accountUrl: process.env.MEETINGS_URL ?? "",
    }),
    instructions: strings.email.invite.instructions,
    request,
    subject: formatString(strings.email.invite.subject, {
      accountName: process.env.ACCOUNT_NAME ?? "",
    }),
    to: email,
  });

  return redirectWith("/users", request, {
    success: strings.users.added,
  });
};

export default function User() {
  const { canAddUsers } = useUser();
  const actionData = useActionData();
  return (
    <Template
      title={strings.users.add}
      breadcrumbs={[["/users", strings.users.title]]}
    >
      {actionData && <Alerts data={actionData} />}
      <Columns primary={<Form form="user" isAdmin={canAddUsers} />}>
        <p>{strings.users.add_description}</p>
      </Columns>
    </Template>
  );
}
