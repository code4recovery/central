import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { Button, Table, Template } from "~/components";
import { getMeetings } from "~/data";
import { strings } from "~/i18n";

export async function loader() {
  return json({ meetings: getMeetings() });
}

export default function Index() {
  const { meetings } = useLoaderData();

  return (
    <Template
      title={strings.meetings_title}
      description={strings.meetings_description}
      cta={<Button url="/create" label={strings.meetings_add} />}
    >
      <Table
        columns={{
          name: { label: "Name" },
          day: { label: "Day" },
          time: { label: "Time" },
          region: { label: "Region", align: "right" },
        }}
        rows={meetings}
      />
    </Template>
  );
}
