import type { Activity } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Button, Columns, Form, Panel, Template } from "~/components";
import { fields, formatValidator, validObjectId } from "~/helpers";
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

  const arrayEquals = (array1: string[], array2: string[]) =>
    array1.length === array2.length &&
    array1.every((value) => array2.includes(value));

  // get changed fields
  const changes = Object.keys(fields.meeting)
    .map((field) => ({
      field,
      type: fields.meeting[field].type,
      before: meeting[field as keyof typeof meeting],
      after: data[field],
    }))
    .filter(({ type, before, after }) =>
      type === "checkboxes"
        ? !arrayEquals(before as string[], after)
        : before !== after
    )
    .filter(({ before, after }) => before || after);

  // exit if no changes
  if (!changes.length) {
    return json({ info: "Nothing was updated." });
  }

  const { id: userID, currentAccountID } = await getUser(request);

  // create an activity record
  const activity = (await db.activity.create({
    data: {
      type: "update",
      meetingID: id,
      userID,
    },
  })) as Activity;

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

  try {
    await saveFeedToStorage(currentAccountID);
    return json({ success: "JSON updated." });
  } catch (e) {
    if (e instanceof Error) {
      return json({ error: e.message });
    }
  }
  return null;
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
    return redirect("/meetings"); // todo flash message
  }
  const meeting = await getMeeting(id);
  if (!meeting) {
    return redirect("/meetings"); // todo flash message
  }
  return json({ meeting });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.edit,
});

export default function EditMeeting() {
  const { meeting } = useLoaderData();
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
        />
        <Panel
          title={strings.reports.title}
          emptyText={strings.reports.empty}
        />
      </Columns>
    </Template>
  );
}
