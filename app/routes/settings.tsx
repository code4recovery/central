import { useContext } from "react";
import type { MetaFunction } from "@remix-run/node";

import { Form, Separator, Template } from "~/components";
import { UserContext } from "~/contexts";
import { getAccount } from "~/data";
import { formatClasses as cx } from "~/helpers";
import { strings } from "~/i18n";
import { DefaultUserIcon, DefaultAccountLogo } from "~/icons";

export const meta: MetaFunction = () => ({
  title: strings.settings_title,
});

export default function Settings() {
  const {
    name: entity,
    url,
    theme: { text },
  } = getAccount();
  const user = useContext(UserContext);
  return (
    user && (
      <Template title={strings.settings_title}>
        <>
          <Form
            title={strings.settings_user_title}
            description={strings.settings_user_description}
            fields={[
              {
                name: "name",
                label: strings.settings_user_name,
                placeholder: strings.settings_user_name_placeholder,
                type: "text",
                span: 6,
                value: user.name,
              },
              {
                name: "email",
                label: strings.settings_user_email,
                type: "email",
                span: 6,
                value: user.email,
              },
              {
                name: "avatar",
                label: strings.settings_user_avatar,
                type: "image",
                defaultImage: <DefaultUserIcon className={text} />,
              },
            ]}
          />
          <Separator />
          <Form
            title={strings.settings_account_title}
            description={strings.settings_account_description}
            fields={[
              {
                name: "entity",
                label: strings.settings_account_entity,
                type: "text",
                value: entity,
              },
              {
                name: "url",
                label: strings.settings_account_url,
                type: "url",
                span: 8,
                placeholder: strings.settings_account_url_placeholder,
                value: url,
              },
              {
                name: "logo",
                label: strings.settings_account_logo,
                type: "image",
                defaultImage: (
                  <DefaultAccountLogo className={cx("w-12 h-12", text)} />
                ),
                helpText: strings.settings_account_logo_help,
              },
              {
                name: "theme",
                label: strings.settings_account_theme,
                type: "colors",
                value: "emerald",
              },
            ]}
          />
        </>
      </Template>
    )
  );
}