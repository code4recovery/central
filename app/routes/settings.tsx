import { Form, Template } from "~/components";
import { getAccount, getUser } from "~/data";
import { formatClasses as cx } from "~/helpers";
import { strings } from "~/i18n";
import { DefaultUserIcon, DefaultAccountLogo } from "~/icons";

export default function Settings() {
  const {
    theme: { text },
  } = getAccount();
  const { name, email } = getUser();
  const {
    name: entity,
    url,
    theme: { name: theme },
  } = getAccount();
  return (
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
              value: name,
            },
            {
              name: "email",
              label: strings.settings_user_email,
              type: "email",
              span: 6,
              value: email,
            },
            {
              name: "avatar",
              label: strings.settings_user_avatar,
              type: "image",
              defaultImage: <DefaultUserIcon className={text} />,
            },
          ]}
        />
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-300" />
          </div>
        </div>
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
              value: theme,
            },
          ]}
        />
      </>
    </Template>
  );
}
