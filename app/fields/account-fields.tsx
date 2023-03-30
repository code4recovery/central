import { formatClasses as cx } from "~/helpers";
import { strings } from "~/i18n";
import { DefaultAccountLogo } from "~/icons";
import { Fields } from "~/types";

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
}): Fields => ({
  accountID: {
    type: "hidden",
    value: currentAccountID,
  },
  name: {
    label: strings.settings_account_entity,
    type: "text",
    value: accountName,
  },
  url: {
    label: strings.settings_account_url,
    placeholder: strings.settings_account_url_placeholder,
    span: 8,
    type: "url",
    value: accountUrl,
  },
  logo: {
    defaultImage: <DefaultAccountLogo className={cx("w-12 h-12", text)} />,
    helpText: strings.settings_account_logo_help,
    label: strings.settings_account_logo,
    type: "image",
  },
  theme: {
    label: strings.settings_account_theme,
    type: "colors",
    value: themeName,
  },
});
