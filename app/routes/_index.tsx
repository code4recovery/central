import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { Button, Table, Template } from "~/components";
import { getMeetings } from "~/data";
import { config, formatString } from "~/helpers";
import { strings } from "~/i18n";

export async function loader() {
  return json({
    meetings: getMeetings(),
    meetings_count: (1234).toLocaleString(),
  });
}

export default function Index() {
  const { meetings, meetings_count } = useLoaderData();

  return (
    <Template
      title={strings.meetings_title}
      description={formatString(strings.meetings_description, {
        meetings_count,
      })}
      cta={<Button url="/meetings/create" label={strings.meetings_add} />}
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
      <div className="pt-10 flex justify-center">
        <Button
          label={formatString(strings.load_more, { count: config.batchSize })}
          onClick={() => {}}
        />
      </div>
    </Template>
  );
}
