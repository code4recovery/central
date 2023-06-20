import type { Activity, Change, Meeting, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Alert, Avatar, Table, Template } from "~/components";
import { fields, formatDate, formatString } from "~/helpers";
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
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      type: true,
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

export default function ActivityScreen() {
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
              changes: Change[];
              group?: Meeting;
              meeting?: Meeting;
              user: User;
            }
          ) => ({
            ...activity,
            ...(activity.meeting
              ? {
                  name: activity.meeting.name,
                  link: `/meetings/${activity.meeting.id}`,
                }
              : {
                  name: activity.group?.name,
                  link: `/groups/${activity.group?.id}`,
                }),
            when: formatDate(activity.createdAt.toString()),
            what: formatString(
              strings.activity[activity.meeting ? "meeting" : "group"][
                activity.type as keyof typeof strings.activity.meeting
              ],
              {
                properties: activity.changes
                  .map(({ field }) =>
                    fields[activity.meeting ? "meeting" : "group"][
                      field
                    ].label?.toLocaleLowerCase()
                  )
                  .join(", "),
              }
            ),
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
