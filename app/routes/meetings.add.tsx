import type { ActionFunction, MetaFunction } from "@remix-run/node";

import { Form, Template } from "~/components";
import { meetingFields } from "~/fields";
import { strings } from "~/i18n";

export const action: ActionFunction = async ({ params }) => {
  console.log(params.meetingId);
};

export const meta: MetaFunction = () => ({
  title: strings.meetings,
});

export default function CreateMeeting() {
  return (
    <Template title={strings.meeting_add}>
      <Form
        title={strings.meeting_details}
        description={strings.meeting_details_description}
        fields={meetingFields()}
      />
    </Template>
  );
}
