import type { Activity, Change, User } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import {
  Alerts,
  Button,
  Columns,
  Form,
  Panel,
  PanelRow,
  Template,
} from "~/components";
import {
  config,
  fields,
  formatChanges,
  formatString,
  formatValidator,
  validObjectId,
} from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, getUser, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  const meeting = await getMeeting(id);

  if (!meeting) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  const validator = formatValidator("meeting");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }

  const changes = formatChanges(fields.meeting, meeting, data);

  // exit if no changes
  if (!changes.length) {
    return json({ info: strings.no_updates });
  }

  const { id: userID, currentAccountID } = await getUser(request);

  // create an activity record
  const activity = await db.activity.create({
    data: {
      type: "update",
      meetingID: id,
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

  // prepare checkbox updates
  const changedCheckboxFields: {
    [key: string]: {
      connect: { code: string }[];
      disconnect: { code: string }[];
    };
  } = {};

  changes
    .filter(({ type }) => type === "checkboxes")
    .forEach(({ field, before, after }) => {
      if (Array.isArray(before) && Array.isArray(after)) {
        const connect = after
          .filter((value) => !before.includes(value))
          .map((code: string) => ({ code }));
        const disconnect = before
          .filter((value) => !after.includes(value))
          .map((code: string) => ({ code }));
        changedCheckboxFields[field] = { connect, disconnect };
      }
    });

  // update meeting
  const changed = Object.fromEntries(
    changes
      .filter(({ type }) => type !== "checkboxes")
      .map(({ field, after }) => [field, after])
  );

  await db.meeting.update({
    data: { ...changed, ...changedCheckboxFields, updatedAt: new Date() },
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

async function getMeeting(id: string) {
  const meeting = await db.meeting.findUnique({
    where: { id },
    include: {
      group: true,
      languages: true,
      types: true,
    },
  });
  return {
    ...meeting,
    languages: meeting?.languages.map(({ code }) => code),
    types: meeting?.types.map(({ code }) => code),
  };
}

export const loader: LoaderFunction = async ({ params: { id } }) => {
  if (!validObjectId(id)) {
    return redirect(config.home); // todo throw 404
  }
  const meeting = await getMeeting(id);
  if (!meeting) {
    return redirect(config.home); // todo throw 404
  }
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
    where: { meetingID: meeting.id },
  });

  return json({ activities, meeting });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.edit,
});

export default function EditMeeting() {
  const { activities, meeting } = useLoaderData();
  const actionData = useActionData<typeof action>();
  const { accountUrl } = useUser();

  return (
    <Template
      title={strings.meetings.edit}
      breadcrumbs={[
        ["/groups", strings.group.title],
        [`/groups/${meeting.group.id}`, meeting.group.name],
      ]}
    >
      <Columns
        primary={
          <>
            {actionData && <Alerts data={actionData} />}
            <Form form="meeting" values={meeting} />
          </>
        }
      >
        <div className="flex gap-5 flex-wrap">
          <Button
            icon="external"
            secondary
            url={`${accountUrl}?id=${meeting.id}`}
          >
            {strings.meetings.view}
          </Button>
          <Button
            icon="duplicate"
            onClick={() => alert("not implemented yet")}
            secondary
          >
            {strings.meetings.duplicate}
          </Button>
          <Button
            icon="archive"
            onClick={() => alert("not implemented yet")}
            secondary
          >
            {strings.meetings.archive}
          </Button>
        </div>
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
          title={strings.reports.title}
          emptyText={strings.reports.empty}
        />
      </Columns>
    </Template>
  );
}
