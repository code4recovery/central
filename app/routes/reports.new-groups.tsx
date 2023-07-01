import type { Activity, Group, Meeting, User } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { Alert, Avatar, LoadMore, Table, Template } from "~/components";
import { formatDate, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { countGroups, getGroups } from "~/models";
import { getIDs } from "~/utils";

// shared where condition
const where = {
  createdAt: { gte: DateTime.now().minus({ week: 1 }).toJSDate() },
};

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

  const { skip } = data;

  const { currentAccountID } = await getIDs(request);

  return json(getGroups(currentAccountID, skip, where));
};

export const loader: LoaderFunction = async ({ request }) => {
  const { currentAccountID } = await getIDs(request);
  return json({
    loadedGroups: await getGroups(currentAccountID, 0, where),
    groupCount: await countGroups(currentAccountID, where),
  });
};

export const meta: MetaFunction = () => ({
  title: strings.reports.title,
});

export default function NewGroups() {
  const { loadedGroups, groupCount } = useLoaderData<typeof loader>();
  const [groups, setGroups] = useState<
    Array<
      Group & {
        meetings: Meeting[];
        activity: Array<Activity & { user: User }>;
      }
    >
  >(loadedGroups);

  const actionData = useActionData();

  useEffect(() => {
    if (actionData) {
      setGroups((groups) => [...groups, ...actionData]);
    }
  }, [actionData]);

  return (
    <Template
      title={strings.reports.new_groups.title}
      description={formatString(strings.reports.new_groups.description, {
        count: groupCount,
      })}
      breadcrumbs={[["/reports", strings.reports.title]]}
    >
      {!groupCount && (
        <Alert message={strings.reports.new_groups.empty} type="info" />
      )}
      <Table
        columns={{
          name: { label: strings.group.name },
          meetings: { label: strings.meetings.title },
          user: { label: strings.activity.who },
          createdAt: { label: strings.created, align: "right" },
        }}
        rows={groups.map(({ id, meetings, name, createdAt, activity }) => ({
          id,
          link: `/groups/${id}`,
          meetings: meetings.length,
          name,
          user: (
            <div className="flex gap-2 items-center">
              <Avatar
                emailHash={activity[0].user.emailHash}
                name={activity[0].user.name}
              />
              {activity[0].user.name}
            </div>
          ),
          createdAt: formatDate(createdAt.toString()),
        }))}
      />
      {groups.length < groupCount && (
        <LoadMore loadedCount={groups.length} totalCount={groupCount} />
      )}
    </Template>
  );
}
