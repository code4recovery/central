import { strings } from "~/i18n";
import { Template, Table } from "~/components";

export default function Reports() {
  return (
    <Template
      title={strings.reports_title}
      description={strings.reports_description}
    >
      <Table />
    </Template>
  );
}
