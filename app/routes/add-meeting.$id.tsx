import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Columns, Form, HelpTopic, Template } from "~/components";
import { formatValidator } from "~/helpers";
import { strings } from "~/i18n";
import { db, getUser, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const validator = formatValidator("meeting");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }

  const {
    name,
    day,
    time,
    timezone,
    duration,
    conference_url,
    conference_url_notes,
    conference_phone,
    conference_phone_notes,
    notes,
    languages,
    types,
  } = data;

  const { id: userID, currentAccountID } = await getUser(request);

  const groupID = "todo"; // todo

  // update meeting
  const meeting = await db.meeting.create({
    data: {
      name,
      day,
      time,
      timezone,
      duration,
      conference_url,
      conference_url_notes,
      conference_phone,
      conference_phone_notes,
      notes,
      group: {
        connect: { id: groupID },
      },
      languages: {
        connect: [
          ...languages.map((code: string) => ({
            code,
          })),
        ],
      },
      types: types.length
        ? {
            connect: [
              ...types.map((code: string) => ({
                code,
              })),
            ],
          }
        : undefined,
      account: { connect: { id: currentAccountID } },
    },
  });

  // create an activity record
  await db.activity.create({
    data: {
      type: "create",
      meetingID: meeting.id,
      userID,
    },
  });

  // save feed
  try {
    await saveFeedToStorage(currentAccountID);
    return json({ success: strings.json_updated });
  } catch (e) {
    if (e instanceof Error) {
      return json({ error: e.message });
    }
  }
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.title,
});

export default function CreateMeeting() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  return (
    <Template
      title={strings.meetings.add}
      breadcrumbs={[["/meetings", strings.meetings.title]]}
    >
      <Columns
        primary={
          <>
            {actionData && <Alerts data={actionData} />}
            <Form form="meeting" values={loaderData} />
          </>
        }
      >
        <HelpTopic
          title={strings.help.conference_providers_title}
          content={strings.help.conference_providers_content}
        />
        <HelpTopic
          title={strings.help.online_location_title}
          content={strings.help.online_location_description}
        />
      </Columns>
    </Template>
  );
}
