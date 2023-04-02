import { strings } from "~/i18n";
import { DefaultUserIcon } from "~/icons";
import { Fields } from "~/types";

export const userFields = ({
  name,
  email,
  text,
  id,
}: {
  name?: string;
  email?: string;
  text?: string;
  id?: string;
}): Fields => ({
  id: {
    type: "hidden",
    value: id,
  },
  name: {
    label: strings.users.name,
    placeholder: strings.users.name_placeholder,
    helpText: strings.users.name_description,
    span: 6,
    type: "text",
    value: name,
  },
  email: {
    label: strings.users.email,
    span: 6,
    type: "email",
    value: email,
  },
});
