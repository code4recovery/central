import { strings } from "~/i18n";
import { Template } from "~/components";

export default function Profile() {
  return (
    <Template
      title={strings.profile_title}
      description={strings.profile_description}
    ></Template>
  );
}
