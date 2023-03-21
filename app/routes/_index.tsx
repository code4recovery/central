import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import md5 from "blueimp-md5";

import { Button, Footer, Input, Label } from "~/components";
import { config } from "~/helpers";
import { strings } from "~/i18n";
import { DefaultAccountLogo } from "~/icons";
import { createUserSession, db } from "~/utils";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  invariant(email && typeof email === "string");

  const emailHash = md5(email);

  let user = await db.user.findFirst({ where: { email } });

  if (!user) {
    user = await db.user.create({
      data: {
        email,
        emailHash,
      },
    });
  }

  return await createUserSession(user.id, config.home);
}

export const meta: MetaFunction = () => ({
  title: strings.sign_in_title,
});

export default function Index() {
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
          <Label htmlFor="email">{strings.settings_user_email}</Label>
          <Input
            autoComplete="email"
            autoFocus
            name="email"
            type="email"
            required
          />
          <Button label={strings.sign_in_submit} className="mt-6 w-full" />
        </Form>
      </div>
      <Footer />
    </>
  );
}
