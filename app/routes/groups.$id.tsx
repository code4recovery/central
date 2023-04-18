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
} from "~/helpers";
import {
  Alerts,
  Button,
  Columns,
  Form,
  Panel,
  PanelRow,
  Table,
  Template,
} from "~/components";
import { strings } from "~/i18n";
import { db, getIDs, jsonWith, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/groups"); // todo flash invalid id message to this page
  }

  const group = await db.group.findUnique({
    where: { id },
    include: {
      meetings: true,
    },
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

  const { id: userID, currentAccountID } = await getIDs(request);

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

  if (!group.meetings.length) {
    return json({ success: strings.group.updated });
  }

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

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/groups"); // todo throw 404
  }

  const group = await db.group.findUnique({
    select: {
      id: true,
      name: true,
      recordID: true,
      notes: true,
      email: true,
      phone: true,
      website: true,
      venmo: true,
      paypal: true,
      square: true,
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
    return redirect("/groups"); // todo throw 404
  }

  const users = await db.user.findMany({
    where: {
      groupIDs: { has: id },
    },
    select: {
      id: true,
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

  return jsonWith(request, { activities, group, users });
};

export default function GroupEdit() {
  const { activities, alert, group, users } = useLoaderData();
  const actionData = useActionData();
  const alerts = { ...actionData, ...alert };
  return (
    <Template
      breadcrumbs={[["/groups", strings.group.title]]}
      title={strings.group.edit}
    >
      <Columns
        primary={
          <>
            {alerts && <Alerts data={alerts} />}
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
            <div className="flex justify-center pt-4">
              <Button url={`/add-meeting/${group.id}`}>
                {strings.meetings.add}
              </Button>
            </div>
          </>
        }
      >
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
                          .map(({ field }) =>
                            fields.group[field].label?.toLocaleLowerCase()
                          )
                          .join(", "),
                      })
                }
              />
            )
          )}
        </Panel>
      </Columns>
    </Template>
  );
}
