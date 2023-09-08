import type { Activity, Change, Group, Meeting, User } from "@prisma/client";
import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { Alert, Avatar, LoadMore, Table, Template } from "~/components";
import { formatActivity, formatDate, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const meta: MetaFunction = () => ({
  title: strings.requests.title,
});

export const loader: LoaderFunction = async () => {
  const loadedActivity = await db.activity.findMany({
    include: { changes: true, group: true, meeting: true, user: true },
    where: {
      AND: {
        type: { startsWith: "request" },
        OR: [{ approved: null }, { approved: { isSet: false } }],
      },
    },
  });
  return json({ loadedActivity });
};

export default function RequestsScreen() {
  const { loadedActivity, activityCount } = useLoaderData();
  const actionData = useActionData();
  const [activity, setActivity] = useState<
    Array<
      Activity & {
        changes: Change[];
        group?: Group;
        meeting?: Meeting;
        user: User;
      }
    >
  >(loadedActivity);

  useEffect(() => {
    if (actionData) {
      setActivity((activity) => [...activity, ...actionData]);
    }
  }, [actionData]);

  return (
    <Template title={strings.requests.title_full}>
      {!activity.length && (
        <Alert message={strings.requests.empty} type="info" />
      )}
      <Table
        columns={{
          name: { label: strings.activity.name },
          user: { label: strings.activity.who },
          what: { label: strings.activity.what },
          when: { label: strings.activity.when, align: "right" },
        }}
        rows={activity.map((activity) => ({
          ...activity,
          ...(activity.meeting
            ? {
                name: activity.meeting.name,
                link: `/meetings/${activity.meeting.id}/activity/${activity.id}`,
              }
            : {
                name: activity.group?.name,
                link: `/groups/${activity.group?.id}/activity/${activity.id}`,
              }),
          when: formatDate(activity.createdAt.toString()),
          what: formatString(
            strings.activity[activity.meeting ? "meeting" : "group"][
              activity.type as keyof typeof strings.activity.meeting
            ],
            formatActivity({
              ...activity,
              type: activity.meeting ? "meeting" : "group",
            })
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
        }))}
      />
      {activity.length < activityCount && (
        <LoadMore loadedCount={activity.length} totalCount={activityCount} />
      )}
    </Template>
  );
}
