import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { Button, Table, Template } from "~/components";
import { config, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export async function loader() {
  const meetings = await db.meeting.findMany();

  return json({
    meetings: meetings.map((meeting) => ({
      ...meeting,
      link: `/meetings/${meeting.id}`,
      day: meeting.day ? config.days[meeting.day] : undefined,
    })),
  });
}

export default function Index() {
  const { meetings } = useLoaderData();
  const batchSize = 25;
  const [showing, setShowing] = useState(batchSize);

  return (
    <Template
      title={strings.meetings_title}
      description={formatString(strings.meetings_description, {
        meetings_count: meetings.length,
      })}
      cta={<Button url="/meetings/create" label={strings.meetings_add} />}
    >
      <Table
        columns={{
          name: { label: "Name" },
          day: { label: "Day" },
          time: { label: "Time" },
          timezone: { label: "Timezone", align: "right" },
        }}
        rows={meetings.slice(0, showing)}
      />
      {showing < meetings.length && (
        <div className="pt-10 flex justify-center">
          <Button
            label={formatString(strings.load_more, { count: config.batchSize })}
            onClick={() => setShowing(showing + batchSize)}
          />
        </div>
      )}
    </Template>
  );
}
