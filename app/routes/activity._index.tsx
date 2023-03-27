import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Activity } from "@prisma/client";

import { strings } from "~/i18n";
import { Alert, Table, Template } from "~/components";
import { db } from "~/utils";
import { formatDateDiff } from "~/helpers";

export const loader: LoaderFunction = async () => {
  const activities = await db.activity.findMany({
    take: 25,
    include: { meeting: true, user: true },
  });
  return json({
    activities: activities.map((activity) => ({
      ...activity,
      user: undefined,
      userName: activity.user.name,
      meeting: undefined,
      meetingName: activity.meeting.name,
      link: `/meetings/${activity.meeting.id}`,
      createdAt: formatDateDiff(activity.createdAt),
      type: strings[`activity_${activity.type}` as keyof typeof strings],
    })),
  });
};

export const meta: MetaFunction = () => ({
  title: strings.activity_title,
});

export default function Activity() {
  const { activities } = useLoaderData();
  return (
    <Template
      title={strings.activity_title}
      description={strings.activity_description}
    >
      {!activities.length && (
        <Alert message={strings.activity_none} type="warning" />
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
