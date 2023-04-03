import { strings } from "~/i18n";
import { DefaultUserIcon } from "~/icons";
import { Fields } from "~/types";

export const userFields = ({
  currentAccountID,
  email,
  id,
  name,
}: {
  currentAccountID?: string;
  email?: string;
  id?: string;
  name?: string;
} = {}): Fields => ({
  id: {
    type: "hidden",
    value: id,
  },
  currentAccountID: { type: "hidden", value: currentAccountID },
  name: {
    helpText: strings.users.name_description,
    label: strings.users.name,
    placeholder: strings.users.name_placeholder,
    span: 6,
    type: "text",
    value: name,
  },
  email: {
    helpText: strings.users.email_description,
    label: strings.users.email,
    span: 6,
    type: "email",
    value: email,
  },
});
