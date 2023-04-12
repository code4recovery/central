import { Activity, Change, Meeting, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Alert, Avatar, Table, Template } from "~/components";
import { formatUpdated, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const loader: LoaderFunction = async () => {
  const activities = await db.activity.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      createdAt: true,
      changes: {
        select: { field: true },
      },
      meeting: {
        select: {
          id: true,
          name: true,
        },
      },
      user: {
        select: {
          name: true,
          emailHash: true,
        },
      },
    },
    take: 25,
  });
  return json({ activities });
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
          name: { label: strings.activity.name },
          user: { label: strings.activity.who },
          what: { label: strings.activity.what },
          when: { label: strings.activity.when, align: "right" },
        }}
        rows={activities.map(
          (
            activity: Activity & {
              user: User;
              meeting: Meeting;
              changes: Change[];
            }
          ) => ({
            ...activity,
            name: activity.meeting.name,
            link: `/meetings/${activity.meeting.id}`,
            when: formatUpdated(activity.createdAt.toString()),
            what: formatString(strings.activity.update, {
              properties: activity.changes.map(({ field }) => field).join(", "),
            }),
            user: (
              <div className="flex gap-2 items-center">
                <Avatar
                  emailHash={activity.user.emailHash}
                  name={activity.user.name}
                />
                {activity.user.name}
              </div>
            ),
          })
        )}
      />
    </Template>
  );
}
