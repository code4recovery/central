import { useContext, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";

import { Button, Table, Template } from "~/components";
import { config, formatDateDiff, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";
import { UserContext } from "~/contexts";

export const meta: MetaFunction = () => ({
  title: strings.meetings_title,
});

export async function loader() {
  const meetings = await db.meeting.findMany({
    take: 25,
    orderBy: { updatedAt: "desc" },
  });

  return json({
    meetings: meetings.map((meeting) => ({
      ...meeting,
      link: `/meetings/${meeting.id}`,
      updated: formatDateDiff(meeting.updatedAt ?? meeting.createdAt),
      start: meeting.start
        ? meeting.start.toLocaleTimeString("en-us", {
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
            timeZone: meeting.timezone || undefined,
          })
        : "Ongoing",
    })),
  });
}

export default function Index() {
  const { meetings } = useLoaderData();
  const [showing, setShowing] = useState(config.batchSize);
  const user = useContext(UserContext);

  if (!user) return null;

  return (
    <Template
      title={strings.meetings_title}
      description={formatString(strings.meetings_description, {
        meetings_count: user.accountMeetingCount,
      })}
      cta={<Button url="/meetings/add" label={strings.meetings_add} />}
    >
      <Table
        columns={{
          name: { label: "Name" },
          start: { label: "When" },
          timezone: { label: "Timezone" },
          updated: { label: "Updated", align: "right" },
        }}
        rows={meetings.slice(0, showing)}
      />
      {showing < meetings.length && (
        <div className="pt-10 flex justify-center">
          <Button
            label={formatString(strings.load_more, {
              count: config.batchSize,
            })}
            onClick={() => setShowing(showing + config.batchSize)}
          />
        </div>
      )}
    </Template>
  );
}
