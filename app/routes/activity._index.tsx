import type { Activity, Change, Meeting, User } from "@prisma/client";
import {
  json,
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { Alert, Avatar, LoadMore, Table, Template } from "~/components";
import { fields, formatDate, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { getActivity, getActivityCount } from "~/models";
import { getIDs, jsonWith } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const validator = withZod(
    z.object({
      skip: zfd.numeric(),
    })
  );

  const { data, error } = await validator.validate(await request.formData());

  if (error) {
    return validationError(error);
  }

  const { currentAccountID } = await getIDs(request);

  const activity = await getActivity(currentAccountID, data.skip);

  return json(activity);
};

export const loader: LoaderFunction = async ({ request }) => {
  const { currentAccountID } = await getIDs(request);
  const activityCount = await getActivityCount(currentAccountID);
  const loadedActivity = await getActivity(currentAccountID);
  return jsonWith(request, { loadedActivity, activityCount });
};

export const meta: MetaFunction = () => ({
  title: strings.activity.title,
});

export default function ActivityScreen() {
  const { loadedActivity, activityCount } = useLoaderData();
  const actionData = useActionData();
  const [activity, setActivity] = useState<
    Array<
      Activity & {
        changes: Change[];
        group?: Meeting;
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
    <Template title={strings.activity.title}>
      {!activity.length && (
        <Alert message={strings.activity.empty} type="info" />
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
        }))}
      />
      {activity.length < activityCount && (
        <LoadMore loadedCount={activity.length} totalCount={activityCount} />
      )}
    </Template>
  );
}
