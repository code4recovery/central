import type { ActionArgs } from "@remix-run/node";

import { Form, Template } from "~/components";
import { config } from "~/helpers";

export const action = async ({ params }: ActionArgs) => {
  console.log(params.meetingId);
};

export default function CreateMeeting() {
  return (
    <Template title="Edit meeting">
      <Form title="Meeting details" fields={config.meetingFields} />
    </Template>
  );
}
