import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import md5 from "blueimp-md5";
import { validationError } from "remix-validated-form";

import { Alerts, Footer, Form } from "~/components";
import {
  config,
  formatClasses as cx,
  formatString,
  formatToken,
  formatValidator,
} from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { DefaultAccountLogo } from "~/icons";
import { createUserSession, db, sendMail } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const subaction = formData.get("subaction")?.toString();

  if (!subaction) {
    return;
  }

  const validator = formatValidator(subaction);

  const { data, error } = await validator.validate(formData);

  if (error) {
    return validationError(error);
  }

  if (subaction === "account-create") {
    const { email, name, account_name, url } = data;

    const emailHash = md5(email);

    const themes = Object.keys(config.themes);
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const account = await db.account.create({
      data: {
        name: account_name,
        theme,
        url,
      },
    });

    const user = await db.user.create({
      data: {
        email,
        emailHash,
        name,
        currentAccountID: account.id,
        lastSeen: new Date(),
        accounts: {
          connect: { id: account.id },
        },
        adminAccounts: {
          connect: { id: account.id },
        },
      },
    });

    return await createUserSession(user);
  }

  const { email, go } = data;

  const user = await db.user.findUnique({
    select: {
      id: true,
      emailHash: true,
      currentAccountID: true,
      accountIDs: true,
    },
    where: { email },
  });

  if (user && user.accountIDs.length) {
    const loginToken = formatToken();
    await db.user.update({
      data: { loginToken },
      where: { id: user.id },
    });

    try {
      const buttonLink = `/auth/${user.emailHash}/${loginToken}${
        go ? `?${new URLSearchParams({ go })}` : ""
      }`;
      await sendMail({
        accountID: user.currentAccountID,
        buttonLink,
        buttonText: strings.email.login.buttonText,
        headline: formatString(strings.email.login.headline, { email }),
        instructions: strings.email.login.instructions,
        request,
        subject: strings.email.login.subject,
        to: email,
      });
    } catch (e) {
      if (e instanceof Error) {
        return json({ error: e.message });
      }
    }
  }

  return json({ info: strings.auth.email_sent });
};

export const loader: LoaderFunction = async () => {
  const countAccounts = await db.account.count();
  return json({ countAccounts });
};

export const meta: MetaFunction = () => ({
  title: strings.auth.title,
});

export default function Index() {
  const { countAccounts } = useLoaderData();
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
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight">
            {countAccounts ? strings.auth.title : "Welcome to Central"}
          </h1>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-5">
          {actionData && <Alerts data={actionData} />}
          {countAccounts ? (
            <Form
              form="login"
              submitLoadingText={strings.loading}
              submitText={strings.auth.submit}
              values={{ go: searchParams.get("go") ?? "" }}
            />
          ) : (
            <Form
              form="account-create"
              submitLoadingText={strings.loading}
              submitText={strings.auth.get_started}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
