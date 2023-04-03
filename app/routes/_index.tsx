import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";

import { Alerts, Button, Footer, Input, Label } from "~/components";
import { formatClasses as cx, formatToken, validFormData } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { DefaultAccountLogo } from "~/icons";
import { db, sendMail } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const { email, go } = await validFormData(request, {
    email: {
      type: "email",
      required: true,
    },
    go: {
      type: "hidden",
    },
  });

  const user = await db.user.findFirst({
    where: { email },
    include: {
      accounts: true,
    },
  });

  if (user) {
    const loginToken = formatToken();
    await db.user.update({
      data: {
        loginToken,
      },
      where: { id: user.id },
    });

    try {
      const buttonLink = `/auth/${user.emailHash}/${loginToken}${
        go ? `?go=${go}` : ""
      }`;
      await sendMail(
        email,
        "login",
        request,
        buttonLink,
        user?.currentAccountID
      );
    } catch (e) {
      if (e instanceof Error) {
        return json({ error: e.message });
      }
    }
  }
  return json({ info: strings.auth.email_sent });
};

export const meta: MetaFunction = () => ({
  title: strings.auth.title,
});

export default function Index() {
  const { state } = useNavigation();
  const idle = state === "idle";
  const {
    theme: { text },
  } = useUser();
  const [searchParams] = useSearchParams();
  const actionData = useActionData() ?? {};
  if (searchParams.get("msg") === "expired") {
    actionData.warning = strings.auth.expired;
  }
  return (
    <>
      <div className="flex flex-grow flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <DefaultAccountLogo className={cx("h-12 w-auto mx-auto", text)} />
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {strings.auth.title}
          </h1>
        </div>
        <div className=" mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-5">
          {actionData && <Alerts data={actionData} />}
          <Form
            className="bg-white py-8 px-4 shadow sm:rounded sm:px-10"
            method="post"
          >
            <fieldset disabled={!idle}>
              <input
                name="go"
                type="hidden"
                value={searchParams.get("go") ?? undefined}
              />
              <Label htmlFor="email">{strings.users.email}</Label>
              <Input autoFocus name="email" required type="email" />
              <Button
                className="mt-4 w-full"
                label={!idle ? strings.loading : strings.auth.submit}
              />
            </fieldset>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}
