import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Form, Template } from "~/components";
import { config } from "~/helpers";
import { strings } from "~/i18n";

export const meta: MetaFunction = () => ({
  title: strings.meetings_edit_title,
});

export const loader = async ({ params }: LoaderArgs) => {
  return json({ meeting: {} });
};

export const action = async ({ params }: ActionArgs) => {
  console.log(params.meetingId);
};

export default function EditMeeting() {
  const { meeting } = useLoaderData();
  return (
    <Template title={strings.meetings_edit_title}>
      <Form
        title={strings.meetings_details}
        description={strings.meetings_details_description}
        fields={config.meetingFields.map((field) => ({
          ...field,
          value: meeting[field.name],
        }))}
      />
    </Template>
  );
}
