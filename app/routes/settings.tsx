import type { MetaFunction } from "@remix-run/node";

import { Form, Separator, Template } from "~/components";
import { formatClasses as cx } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { DefaultUserIcon, DefaultAccountLogo } from "~/icons";

export const meta: MetaFunction = () => ({
  title: strings.settings_title,
});

export default function Settings() {
  const {
    accountName,
    accountUrl,
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
            label: strings.settings_account_entity,
            name: "entity",
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
