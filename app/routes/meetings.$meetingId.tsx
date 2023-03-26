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

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  const accountID = formData.get("accountID")?.toString() || "";
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
  const { accountID } = useUser();
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
        ]}
      />
    </Template>
  );
}
