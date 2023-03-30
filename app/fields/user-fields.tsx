import { strings } from "~/i18n";
import { DefaultUserIcon } from "~/icons";
import { Fields } from "~/types";

export const userFields = ({
  name,
  email,
  text,
  userID,
}: {
  name?: string;
  email?: string;
  text?: string;
  userID?: string;
}): Fields => ({
  userID: {
    type: "hidden",
    value: userID,
  },
  name: {
    label: strings.settings_user_name,
    placeholder: strings.settings_user_name_placeholder,
    span: 6,
    type: "text",
    value: name,
  },
  email: {
    label: strings.settings_user_email,
    span: 6,
    type: "email",
    value: email,
  },
  avatar: {
    defaultImage: <DefaultUserIcon className={text} />,
    label: strings.settings_user_avatar,
    type: "image",
  },
});
