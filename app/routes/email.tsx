import { ActionFunction, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import { Alerts, Form, Template } from "~/components";
import { validFormData } from "~/helpers";
import { sendMail } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const { email } = await validFormData(request, { email: { type: "email" } });
  try {
    await sendMail(email);
  } catch (e) {
    if (e instanceof Error) {
      return json({ error: e.message });
    }
  }
  return json({ success: "Email sent successfully" });
};

export default function Email() {
  const actionData = useActionData();
  return (
    <Template title="Email">
      {actionData && <Alerts data={actionData} />}
      <Form
        title="Test"
        description="Send a test email using this form."
        fields={{ email: { type: "email", label: "Email" } }}
      />
    </Template>
  );
}
