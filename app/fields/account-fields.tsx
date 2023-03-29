import { formatClasses as cx } from "~/helpers";
import { strings } from "~/i18n";
import { DefaultAccountLogo } from "~/icons";
import { Field } from "~/types";

export const accountFields = ({
  currentAccountID,
  accountName,
  accountUrl,
  themeName,
  text,
}: {
  currentAccountID?: string;
  accountName?: string;
  accountUrl?: string;
  themeName?: string;
  text?: string;
}) =>
  [
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
      defaultImage: <DefaultAccountLogo className={cx("w-12 h-12", text)} />,
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
  ] as Field[];
