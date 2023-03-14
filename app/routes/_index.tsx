import { strings } from "~/i18n";
import { Button, Table, Template } from "~/components";

export default function Index() {
  return (
    <Template
      title={strings.meetings_title}
      description={strings.meetings_description}
      cta={<Button url="/create" label={strings.meetings_add} />}
    >
      <Table />
    </Template>
  );
}
