import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import { Alert, Form, Template } from "~/components";
import { config, validObjectId } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const accountID = formData.get("accountID")?.toString() || "";
  const meetingID = formData.get("meetingID")?.toString() || "";
  const userID = formData.get("userID")?.toString() || "";

  const meeting = await db.meeting.findUnique({ where: { id: meetingID } });

  if (!meeting) {
    return json({ error: "meeting not found" });
  }
  const activity = await db.activity.create({
    data: {
      type: "update",
      meetingID,
      userID,
    },
  });
  const changes = config.meetingFields
    .filter(
      ({ name }) => formData.get(name) !== meeting[name as keyof typeof meeting]
    )
    .forEach(async ({ name }) => {
      await db.change.create({
        data: {
          activityID: activity.id ?? "",
          before: `${meeting[name as keyof typeof meeting]}`,
          after: `${formData.get(name)}`,
          field: name,
        },
      });
    });

  try {
    await saveFeedToStorage(accountID);
    return json({ success: "JSON updated." });
  } catch (e) {
    if (e instanceof Error) {
      return json({ error: e.message });
    }
  }
  return null;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!validObjectId(params.meetingId)) {
    return redirect("/meetings");
  }
  const meeting = await db.meeting.findFirst({
    where: { id: params.meetingId },
  });
  if (!meeting) {
    return redirect("/meetings");
  }
  return json({
    meeting: { ...meeting, day: meeting?.day?.toString() },
  });
};

export const meta: MetaFunction = () => ({
  title: strings.meeting_edit,
});

export default function EditMeeting() {
  const { meeting } = useLoaderData();
  const { accountID, id } = useUser();
  const data = useActionData<typeof action>();
  return (
    <Template title={strings.meeting_edit}>
      {data?.error && <Alert type="danger" message={data.error} />}
      {data?.success && <Alert type="success" message={data.success} />}
      <Form
        title={strings.meeting_details}
        description={strings.meeting_details_description}
        fields={[
          ...config.meetingFields.map((field) => ({
            ...field,
            value: ["types", "languages"].includes(field.name)
              ? meeting.types.split(",")
              : meeting[field.name],
          })),
          {
            name: "accountID",
            value: accountID,
          },
          {
            name: "meetingID",
            value: meeting.id,
          },
          {
            name: "userID",
            value: id,
          },
        ]}
      />
    </Template>
  );
}
