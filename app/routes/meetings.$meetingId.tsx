import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Form, Template } from "~/components";
import { config, validObjectId } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const action: ActionFunction = async ({ params }) => {
  console.log(params.meetingId);
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
  return (
    <Template title={strings.meeting_edit}>
      <Form
        title={strings.meeting_details}
        description={strings.meeting_details_description}
        fields={config.meetingFields.map((field) => ({
          ...field,
          value: ["types", "languages"].includes(field.name)
            ? meeting.types.split(",")
            : meeting[field.name],
        }))}
      />
    </Template>
  );
}
