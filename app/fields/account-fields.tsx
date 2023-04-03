import { strings } from "~/i18n";
import { Fields } from "~/types";

export const accountFields = ({
  name,
  url,
  theme,
  id,
}: {
  name?: string;
  url?: string;
  theme?: string;
  id?: string;
} = {}): Fields => ({
  id: {
    type: "hidden",
    value: id,
  },
  name: {
    label: strings.account.entity,
    type: "text",
    value: name,
  },
  url: {
    label: strings.account.url,
    placeholder: strings.account.url_placeholder,
    span: 8,
    type: "url",
    value: url,
  },
  theme: {
    label: strings.account.theme,
    type: "colors",
    value: theme,
  },
});
