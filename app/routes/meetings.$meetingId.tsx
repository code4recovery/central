import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Form, Template } from "~/components";
import { config } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const meta: MetaFunction = () => ({
  title: strings.meeting_edit,
});

export const loader = async ({ params }: LoaderArgs) => {
  const meeting = await db.meeting.findUnique({
    where: { id: params.meetingId },
  });
  return json({
    meeting: { ...meeting, day: `${meeting?.day}` },
  });
};

export const action = async ({ params }: ActionArgs) => {
  console.log(params.meetingId);
};

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
