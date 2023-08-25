import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Columns, Form, HelpTopic, Template } from "~/components";
import { formatSlug, formatValidator } from "~/helpers";
import { strings } from "~/i18n";
import {
  db,
  getIDs,
  log,
  optionsInUse,
  redirectWith,
  publishDataToFtp,
} from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  const validator = formatValidator("meeting");
  const formData = await request.formData();
  const geocodeID = formData.get("geocodeID[id]")?.toString(); // todo handle programatically
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

  const slugs = (
    await db.meeting.findMany({
      select: { slug: true },
      where: { accountID: currentAccountID },
    })
  ).map(({ slug }) => slug);

  const slug = formatSlug(name, slugs);

  // update meeting
  const meeting = await db.meeting.create({
    data: {
      name,
      slug,
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
        connectOrCreate: languages.map((code: string) => ({
          where: { code },
          create: { code },
        })),
      },
      types: {
        connectOrCreate: types.map((code: string) => ({
          where: { code },
          create: { code },
        })),
      },
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
    await publishDataToFtp(currentAccountID);
  } catch (e) {
    if (e instanceof Error) {
      log(e);
      return json({ error: `File storage error: ${e.message}` });
    }
  }

  // redirect to meeting page
  return redirectWith(`/meetings/${meeting.id}`, request, {
    success: strings.json_updated,
  });
};

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  const { currentAccountID } = await getIDs(request);

  const group = await db.group.findUnique({
    select: { id: true, name: true },
    where: { id },
  });

  return json({ group, optionsInUse: await optionsInUse(currentAccountID) });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.title,
});

export default function CreateMeeting() {
  const actionData = useActionData();
  const { group, optionsInUse } = useLoaderData();
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
            <Form form="meeting" optionsInUse={optionsInUse} />
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
