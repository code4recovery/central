import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { Form, Separator, Template } from "~/components";
import { formatClasses as cx, validFormData } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { DefaultUserIcon, DefaultAccountLogo } from "~/icons";
import { db } from "~/utils";

export const meta: MetaFunction = () => ({
  title: strings.settings_title,
});

export const action: ActionFunction = async ({ request }) => {
  const { accountID, email, userID, name, url, theme } = await validFormData(
    request
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
  } else if (userID) {
    await db.user.update({
      where: { id: accountID as string },
      data: {
        name: name as string,
        email: email as string,
      },
    });
  }
  return redirect(request.url);
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
  } = useUser();
  return (
    <Template title={strings.settings_title}>
      <Form
        title={strings.settings_user_title}
        description={strings.settings_user_description}
        fields={[
          {
            name: "form",
            value: "user",
          },
          {
            label: strings.settings_user_name,
            name: "name",
            placeholder: strings.settings_user_name_placeholder,
            span: 6,
            type: "text",
            value: name,
          },
          {
            label: strings.settings_user_email,
            name: "email",
            span: 6,
            type: "email",
            value: email,
          },
          {
            defaultImage: <DefaultUserIcon className={text} />,
            label: strings.settings_user_avatar,
            name: "avatar",
            type: "image",
          },
        ]}
      />
      <Separator />
      <Form
        title={strings.settings_account_title}
        description={strings.settings_account_description}
        fields={[
          {
            name: "accountID",
            value: currentAccountID,
          },
          {
            label: strings.settings_account_entity,
            name: "name",
            type: "text",
            value: accountName,
          },
          {
            label: strings.settings_account_url,
            name: "url",
            placeholder: strings.settings_account_url_placeholder,
            span: 8,
            type: "url",
            value: accountUrl,
          },
          {
            defaultImage: (
              <DefaultAccountLogo className={cx("w-12 h-12", text)} />
            ),
            helpText: strings.settings_account_logo_help,
            label: strings.settings_account_logo,
            name: "logo",
            type: "image",
          },
          {
            label: strings.settings_account_theme,
            name: "theme",
            type: "colors",
            value: themeName,
          },
        ]}
      />
    </Template>
  );
}
