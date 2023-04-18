import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Columns, Form, HelpTopic, Template } from "~/components";
import { formatValidator } from "~/helpers";
import { strings } from "~/i18n";
import { db, getIDs, redirectWith, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  const validator = formatValidator("meeting");
  const formData = await request.formData();
  const geocodeID = formData.get("geocode[id]")?.toString();
  const { data, error } = await validator.validate(formData);
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

  const { id: userID, currentAccountID } = await getIDs(request);

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
      geocode: { connect: geocodeID ? { id: geocodeID } : undefined },
      group: {
        connect: { id },
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
    return redirectWith(`/meetings/${meeting.id}`, request, {
      success: strings.json_updated,
    });
  } catch (e) {
    if (e instanceof Error) {
      return json({ error: e.message });
    }
  }
};

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const group = await db.group.findUnique({
    select: { id: true, name: true },
    where: { id },
  });
  return json({ group });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.title,
});

export default function CreateMeeting() {
  const actionData = useActionData();
  const { group } = useLoaderData();
  return (
    <Template
      title={strings.meetings.add}
      breadcrumbs={[
        ["/groups", strings.group.title],
        [`/groups/${group.id}`, group.name],
      ]}
    >
      <Columns
        primary={
          <>
            {actionData && <Alerts data={actionData} />}
            <Form form="meeting" />
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
        <HelpTopic
          title={strings.help.phone_format_title}
          content={strings.help.phone_format_description}
        />
      </Columns>
    </Template>
  );
}
