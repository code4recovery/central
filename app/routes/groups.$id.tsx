import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type {
  Activity,
  Change,
  Language,
  Meeting,
  Type,
  User,
} from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useActionData, useLoaderData } from "@remix-run/react";

import {
  fields,
  formatDayTime,
  formatDate,
  formatValidator,
  validObjectId,
  formatChanges,
  formatString,
  formatSelect,
} from "~/helpers";
import {
  Alerts,
  Columns,
  Form,
  Panel,
  PanelRow,
  Table,
  Template,
} from "~/components";
import { strings } from "~/i18n";
import { db, getUser, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/groups"); // todo flash invalid id message to this page
  }

  const group = await db.group.findUnique({
    where: { id },
  });
  if (!group) {
    return redirect("/groups"); // todo flash invalid id message to this page
  }

  const validator = formatValidator("group");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }

  const changes = formatChanges(fields.group, group, data);

  // exit if no changes
  if (!changes.length) {
    return json({ info: strings.no_updates });
  }

  const { id: userID, currentAccountID } = await getUser(request);

  // create an activity record
  const activity = await db.activity.create({
    data: {
      type: "update",
      groupID: id,
      userID,
    },
  });

  // save individual changes
  changes.forEach(
    async ({ field, before, after }) =>
      await db.change.create({
        data: {
          activityID: activity.id,
          before: Array.isArray(before) ? before.join(", ") : `${before}`,
          after: Array.isArray(after) ? after.join(", ") : `${after}`,
          field,
        },
      })
  );

  // update group
  const changed = Object.fromEntries(
    changes
      .filter(({ type }) => type !== "checkboxes")
      .map(({ field, after }) => [field, after])
  );

  await db.group.update({
    data: { ...changed, updatedAt: new Date() },
    where: { id },
  });

  // save feed
  try {
    await saveFeedToStorage(currentAccountID);
    return json({ success: strings.json_updated });
  } catch (e) {
    if (e instanceof Error) {
      return json({ error: e.message });
    }
  }
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  if (!validObjectId(id)) {
    return redirect("/groups"); // todo flash invalid id message to this page
  }

  const group = await db.group.findUnique({
    select: {
      ...formatSelect("group"),
      meetings: {
        select: {
          day: true,
          time: true,
          timezone: true,
          name: true,
          updatedAt: true,
          id: true,
          languages: { select: { code: true } },
          types: { select: { code: true } },
        },
      },
    },
    where: { id },
  });

  if (!group) {
    return redirect("/groups"); // todo flash invalid id message to this page
  }

  const users = await db.user.findMany({
    where: {
      groupIDs: { has: id },
    },
    select: {
      name: true,
      emailHash: true,
      lastSeen: true,
    },
  });

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
      type: true,
      user: {
        select: {
          name: true,
          emailHash: true,
        },
      },
    },
    take: 5,
    where: { groupID: id },
  });

  return json({ activities, group, users });
};

export default function GroupEdit() {
  const { activities, group, users } = useLoaderData();
  const actionData = useActionData();
  return (
    <Template
      breadcrumbs={[["/groups", strings.group.title]]}
      title={strings.group.edit}
    >
      <Columns
        primary={
          <>
            {actionData && <Alerts data={actionData} />}
            <Form form="group" values={group} />
            <Table
              columns={{
                name: { label: strings.meetings.name },
                when: { label: strings.meetings.when },
                types: { label: strings.meetings.types },
                updatedAt: { label: strings.updated, align: "right" },
              }}
              rows={group.meetings.map(
                ({
                  name,
                  id,
                  updatedAt,
                  day,
                  languages,
                  time,
                  timezone,
                  types,
                }: Meeting & { languages: Language[]; types: Type[] }) => ({
                  name,
                  id,
                  link: `/meetings/${id}`,
                  types: [...languages, ...types].map(({ code }) => code),
                  updatedAt: formatDate(updatedAt.toString()),
                  when: formatDayTime(day, time, timezone),
                })
              )}
            />
          </>
        }
      >
        <Panel
          title={strings.activity.title}
          emptyText={strings.activity.empty}
        >
          {activities.map(
            ({
              id,
              changes,
              type,
              user,
              createdAt,
            }: Activity & { changes: Change[]; user: User }) => (
              <PanelRow
                key={id}
                user={user}
                date={createdAt.toString()}
                text={
                  type === "create"
                    ? strings.activity.create
                    : formatString(strings.activity.update, {
                        properties: changes
                          .map(({ field }) => field)
                          .join(", "),
                      })
                }
              />
            )
          )}
        </Panel>
        <Panel
          title={strings.representatives.title}
          emptyText={strings.representatives.empty}
        >
          {users.map((user: User) => (
            <PanelRow
              user={user}
              key={user.id}
              text={user.name}
              date={user.lastSeen?.toString()}
            />
          ))}
        </Panel>
      </Columns>
    </Template>
  );
}
