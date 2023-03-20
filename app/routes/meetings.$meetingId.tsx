import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Form, Template } from "~/components";
import { config } from "~/helpers";

export const loader = async ({ params }: LoaderArgs) => {
  return json({ meeting: {} });
};

export const action = async ({ params }: ActionArgs) => {
  console.log(params.meetingId);
};

export default function EditMeeting() {
  const { meeting } = useLoaderData();
  return (
    <Template title="Edit meeting">
      <Form
        title="Meeting details"
        fields={config.meetingFields.map((field) => ({
          ...field,
          value: meeting[field.name],
        }))}
      />
    </Template>
  );
}
