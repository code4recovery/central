import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Form, Template } from "~/components";
import { strings } from "~/i18n";
import { userFields } from "~/fields";

export const action: ActionFunction = ({ request }) => {
  console.log(request);
  return null;
};

export const loader: LoaderFunction = ({ params }) => {
  console.log(params);
  return null;
};

export default function User() {
  return (
    <Template
      title={strings.users.add}
      breadcrumbs={[["/users", strings.users.title]]}
    >
      <Form
        title={strings.users.title}
        description={strings.users.description}
        fields={userFields({})}
      />
    </Template>
  );
}
