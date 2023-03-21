import type { MetaFunction } from "@remix-run/node";

import { strings } from "~/i18n";
import { Table, Template } from "~/components";

export const meta: MetaFunction = () => ({
  title: strings.activity_title,
});

export default function Activity() {
  return (
    <Template
      title={strings.activity_title}
      description={strings.activity_description}
    >
      <Table
        columns={{
          meeting: { label: "Meeting" },
          user: { label: "User" },
          type: { label: "Type" },
          time: { label: "Time", align: "right" },
        }}
        rows={[
          {
            id: "123091",
            user: "Josh R",
            meeting: "One Day at a Time",
            type: "Update",
            time: "Four hours ago",
          },
        ]}
      />
    </Template>
  );
}
