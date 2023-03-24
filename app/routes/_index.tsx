import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Button, Footer, Input, Label } from "~/components";
import { config } from "~/helpers";
import { strings } from "~/i18n";
import { DefaultAccountLogo } from "~/icons";
import { createUserSession, db } from "~/utils";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  invariant(email && typeof email === "string");

  let user = await db.user.findFirst({ where: { email } });

  if (user) {
    return await createUserSession(user.id, config.home);
  }

  return redirect("/");
}

export const meta: MetaFunction = () => ({
  title: strings.sign_in_title,
});

export default function Index() {
  const { state } = useNavigation();
  const submitting = state === "submitting";
  return (
    <>
      <div className="flex flex-grow flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <DefaultAccountLogo className="h-12 w-auto mx-auto text-emerald-600" />
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {strings.sign_in_title}
          </h1>
        </div>
        <Form
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          method="post"
        >
          <fieldset disabled={submitting}>
            <Label htmlFor="email">{strings.settings_user_email}</Label>
            <Input autoFocus name="email" type="email" required />
            <Button
              label={submitting ? strings.loading : strings.sign_in_submit}
              className="mt-6 w-full"
            />
          </fieldset>
        </Form>
      </div>
      <Footer />
    </>
  );
}
