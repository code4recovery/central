import { strings } from "~/i18n";
import { Template, Table } from "~/components";

export default function Admin() {
  return (
    <Template
      title={strings.admin_title}
      description={strings.admin_description}
    >
      <Table />
    </Template>
  );
}
