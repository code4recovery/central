import type { ActionFunction, MetaFunction } from "@remix-run/node";

import { Form, Template } from "~/components";
import { strings } from "~/i18n";

export const action: ActionFunction = async ({ params: { id } }) => {
  console.log(id);
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.title,
});

export default function CreateMeeting() {
  return (
    <Template
      title={strings.meetings.add}
      breadcrumbs={[["/meetings", strings.meetings.title]]}
    >
      <Form
        title={strings.meetings.details}
        description={strings.meetings.details_description}
        form="meeting"
      />
    </Template>
  );
}
