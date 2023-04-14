import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { Group, Meeting, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { validationError } from "remix-validated-form";

import { Alert, Avatar, Button, LoadMore, Table, Template } from "~/components";
import { config, formatString, formatDate } from "~/helpers";
import { strings } from "~/i18n";
import { db, getUser } from "~/utils";

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

  const { currentAccountID } = await getUser(request);

  const groups = await db.group.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: Number(skip),
    take: config.batchSize,
    where: { accountID: currentAccountID },
  });
  return json(groups);
};

export const loader: LoaderFunction = async ({ request }) => {
  const { currentAccountID } = await getUser(request);
  const groupCount = await db.group.count({
    where: { accountID: currentAccountID },
  });
  const loadedGroups = await db.group.findMany({
    select: {
      id: true,
      name: true,
      updatedAt: true,
      meetings: {
        select: {
          id: true,
        },
      },
      users: {
        select: {
          emailHash: true,
          name: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: config.batchSize,
    where: { accountID: currentAccountID },
  });
  return json({ loadedGroups, groupCount });
};

export const meta: MetaFunction = () => ({
  title: strings.group.title,
});

export default function Index() {
  const { loadedGroups, groupCount } = useLoaderData<typeof loader>();
  const [groups, setGroups] =
    useState<Array<Group & { meetings: Meeting[]; users: User[] }>>(
      loadedGroups
    );
  const actionData = useActionData();

  useEffect(() => {
    if (actionData) {
      setGroups([...groups, ...actionData]);
    }
  }, [groups, actionData]);

  return (
    <Template
      title={strings.group.title}
      description={formatString(strings.group.description, {
        groupCount,
      })}
      cta={<Button url="/groups/add">{strings.group.add}</Button>}
    >
      {!groups.length && <Alert message={strings.group.empty} type="info" />}
      <Table
        columns={{
          name: { label: strings.group.name },
          meetings: { label: strings.meetings.title },
          reps: { label: "Representatives" },
          updatedAt: { label: strings.updated, align: "right" },
        }}
        rows={groups.map(({ id, meetings, name, updatedAt, users }) => ({
          id,
          link: `/groups/${id}`,
          meetings: meetings.length,
          name,
          reps: (
            <div className="pl-2 flex">
              {users.map(({ id, emailHash, name }) => (
                <Avatar
                  key={id}
                  emailHash={emailHash}
                  name={name}
                  className="-ml-2 shadow"
                />
              ))}
            </div>
          ),
          updatedAt: formatDate(updatedAt.toString()),
        }))}
      />
      {groups.length < groupCount && (
        <LoadMore loadedCount={groups.length} totalCount={groupCount} />
      )}
    </Template>
  );
}
