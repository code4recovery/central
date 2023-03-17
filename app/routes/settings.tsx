import { strings } from "~/i18n";
import { Form, Template } from "~/components";

export default function Settings() {
  return (
    <Template title={strings.settings_title}>
      <Form />
    </Template>
  );
}
