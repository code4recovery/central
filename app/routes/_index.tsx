import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useNavigation, useSearchParams } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Button, Footer, Input, Label } from "~/components";
import { config, formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { DefaultAccountLogo } from "~/icons";
import { createUserSession, db } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  invariant(email && typeof email === "string");

  const user = await db.user.findFirst({ where: { email } });

  if (user) {
    return await createUserSession(
      user.id,
      formData.get("go")?.toString() ?? config.home
    );
  }

  return redirect("/");
};

export const meta: MetaFunction = () => ({
  title: strings.sign_in_title,
});

export default function Index() {
  const { state } = useNavigation();
  const submitting = state === "submitting";
  const {
    theme: { text },
  } = useUser();
  const [searchParams] = useSearchParams();
  return (
    <>
      <div className="flex flex-grow flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <DefaultAccountLogo className={cx("h-12 w-auto mx-auto", text)} />
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {strings.sign_in_title}
          </h1>
        </div>
        <Form
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md"
          method="post"
        >
          <fieldset disabled={submitting}>
            <input
              name="go"
              type="hidden"
              value={searchParams.get("go") ?? undefined}
            />
            <Label htmlFor="email">{strings.settings_user_email}</Label>
            <Input autoFocus name="email" required type="email" />
            <Button
              className="mt-6 w-full"
              label={submitting ? strings.loading : strings.sign_in_submit}
            />
          </fieldset>
        </Form>
      </div>
      <Footer />
    </>
  );
}
