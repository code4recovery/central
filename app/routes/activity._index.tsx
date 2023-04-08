import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Alert, Table, Template } from "~/components";
import { formatUpdated, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const loader: LoaderFunction = async () => {
  const activities = await db.activity.findMany({
    take: 25,
    include: { meeting: true, user: true, changes: true },
    orderBy: [{ createdAt: "desc" }],
  });
  return json({
    activities: activities.map((activity) => ({
      ...activity,
      user: undefined,
      userName: activity.user.name,
      meeting: undefined,
      meetingName: activity.meeting.name,
      link: `/meetings/${activity.meeting.id}`,
      createdAt: formatUpdated(activity.createdAt.toISOString()),
      type: formatString(strings.activity.update, {
        properties: activity.changes.map(({ field }) => field).join(", "),
      }),
    })),
  });
};

export const meta: MetaFunction = () => ({
  title: strings.activity.title,
});

export default function Activity() {
  const { activities } = useLoaderData();
  return (
    <Template
      title={strings.activity.title}
      description={strings.activity.description}
    >
      {!activities.length && (
        <Alert message={strings.activity.empty} type="info" />
      )}
      <Table
        columns={{
          meetingName: { label: "Meeting" },
          userName: { label: "User" },
          type: { label: "Type" },
          createdAt: { label: "Time", align: "right" },
        }}
        rows={activities}
      />
    </Template>
  );
}
