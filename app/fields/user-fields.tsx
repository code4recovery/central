import { strings } from "~/i18n";
import { DefaultUserIcon } from "~/icons";
import { Field } from "~/types";

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
}) =>
  [
    {
      name: "userID",
      value: userID,
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
  ] as Field[];
