import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Form, Template } from "~/components";
import { fields, formatValidator, validObjectId } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  // get meeting
  const meeting = await db.meeting.findUnique({ where: { id } });

  if (!meeting) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  const validator = formatValidator("meeting");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }

  console.log(data);

  // get changed fields
  const changes = Object.keys(fields.meeting)
    .filter((name) => data[name] !== meeting[name as keyof typeof meeting])
    .map((name) => [[name], data[name]]);

  // exit if no changes
  if (!changes.length) {
    return json({ info: "Nothing was updated." });
  }

  // create an activity record
  const activity = await db.activity.create({
    data: {
      type: "update",
      meetingID: id,
      userID: data.userID,
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
    where: { id },
  });

  try {
    await saveFeedToStorage(data.currentAccountID);
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
        values={{ ...loaderData, currentAccountID, userID: id }}
      />
    </Template>
  );
}
