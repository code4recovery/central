import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import { Alerts, Form, Template } from "~/components";
import { fields, validObjectId } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const currentAccountID = formData.get("currentAccountID")?.toString() || "";
  const meetingID = formData.get("meetingID")?.toString() || "";
  const userID = formData.get("userID")?.toString() || "";

  const meeting = await db.meeting.findUnique({ where: { id: meetingID } });

  if (!meeting) {
    return json({ error: "Meeting not found." });
  }

  // todo refactor
  const formatValue = (name: string) => {
    if (["day", "duration"].includes(name)) {
      const value = formData.get(name)?.toString();
      return value ? parseInt(value) : null;
    }
    if (["languages", "types"].includes(name)) {
      return formData.getAll(name).join(",");
    }
    return formData.get(name)?.toString();
  };

  // get changed fields
  const changes = Object.keys(fields.meeting)
    .filter(
      (name) => formatValue(name) !== meeting[name as keyof typeof meeting]
    )
    .map((name) => [[name], formatValue(name)]);

  // exit if no changes
  if (!changes.length) {
    return json({ info: "Nothing was updated." });
  }

  // create an activity record
  const activity = await db.activity.create({
    data: {
      type: "update",
      meetingID,
      userID,
    },
  });

  // save individual changes
  changes.forEach(
    async ([field, value]) =>
      await db.change.create({
        data: {
          activityID: activity.id ?? "",
          before: `${meeting[field as keyof typeof meeting]}`,
          after: `${value}`,
          field: `${field}`,
        },
      })
  );

  // update meeting
  await db.meeting.update({
    data: Object.fromEntries(changes),
    where: { id: meetingID },
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

export const loader: LoaderFunction = async ({ params }) => {
  if (!validObjectId(params.id)) {
    return redirect("/meetings"); // todo flash message
  }
  const meeting = await db.meeting.findFirst({
    where: { id: params.id },
  });
  if (!meeting) {
    return redirect("/meetings"); // todo flash message
  }
  return json({ ...meeting, day: meeting?.day?.toString() });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.edit,
});

export default function EditMeeting() {
  const loaderData = useLoaderData();
  const { currentAccountID, id } = useUser();
  const actionData = useActionData<typeof action>();

  return (
    <Template
      title={strings.meetings.edit}
      breadcrumbs={[["/meetings", strings.meetings.title]]}
    >
      {actionData && <Alerts data={actionData} />}
      <Form
        title={strings.meetings.details}
        description={strings.meetings.details_description}
        form="meeting"
        values={loaderData}
      />
    </Template>
  );
}
