import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Columns, Form, HelpTopic, Template } from "~/components";
import { formatSlug, formatValidator } from "~/helpers";
import { strings } from "~/i18n";
import { db, getIDs, optionsInUse, redirectWith } from "~/utils";

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

  const { accountID, userID } = await getIDs(request);

  const slugs = (
    await db.meeting.findMany({
      select: { slug: true },
      where: { accountID },
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
      account: { connect: { id: accountID } },
    },
  });

  // create an activity record
  await db.activity.create({
    data: {
      type: "create", // todo change this to "createMeeting"
      meetingID: meeting.id,
      userID,
    },
  });

  // redirect to meeting page
  return redirectWith(`/meetings/${meeting.id}`, request, {
    success: strings.meetings.added,
  });
};

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  const { accountID } = await getIDs(request);

  const group = await db.group.findUnique({
    select: { id: true, name: true },
    where: { id },
  });

  return json({ group, optionsInUse: await optionsInUse(accountID) });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.title,
});

export default function CreateMeeting() {
  const actionData = useActionData();
  const { group, optionsInUse } = useLoaderData();
  const navigate = useNavigate();
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
            <Form
              cancel={() => navigate(`/groups/${group.id}`)}
              form="meeting"
              optionsInUse={optionsInUse}
            />
          </>
        }
      >
        <HelpTopic
          title={strings.help.conference_providers}
          content={strings.help.conference_providers_content}
        />
        <HelpTopic
          title={strings.help.online_location}
          content={strings.help.online_location_content}
        />
        <HelpTopic
          title={strings.help.phone_format}
          content={strings.help.phone_format_content}
        />
      </Columns>
    </Template>
  );
}
