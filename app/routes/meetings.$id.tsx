import type { Activity, Change, User } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import {
  Alerts,
  Button,
  Columns,
  Form,
  HelpTopic,
  Panel,
  Template,
} from "~/components";
import { ArchiveForm } from "~/components/ArchiveForm";
import {
  fields,
  formatActivity,
  formatChanges,
  formatString,
  formatUrl,
  formatValidator,
  formatValue,
} from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { getMeeting } from "~/models";
import { db, getIDs, jsonWith, optionsInUse } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  const meeting = await getMeeting(id);
  const { userID } = await getIDs(request);

  const formData = await request.formData();

  if (formData.has("subaction")) {
    const archived = formData.get("subaction") === "archive";
    await db.meeting.update({
      where: { id },
      data: {
        archived,
      },
    });
    await db.activity.create({
      data: {
        meetingID: id,
        type: archived ? "archive" : "unarchive", // todo change this to archiveMeeting | unarchiveMeeting
        userID,
      },
    });
  }

  const validator = formatValidator("meeting");
  const { data, error } = await validator.validate(formData);
  if (error) {
    return validationError(error);
  }

  // patch geocode data
  Object.keys(fields.meeting)
    .filter((field) => fields.meeting[field].type === "geocode")
    .forEach((field) => {
      const value = formData.get(`${field}[id]`)?.toString();
      data[field] = value;
    });

  const changes = formatChanges(fields.meeting, meeting, data);

  // exit if no changes
  if (!changes.length) {
    return json({ info: strings.no_updates });
  }

  // check how many meetings to update
  const meetingIDs =
    formData.get("save-option") === "all"
      ? (
          await db.meeting.findMany({
            select: { id: true },
            where: { groupID: meeting.groupID },
          })
        ).map(({ id }) => id)
      : formData.get("save-option") === "same_time"
      ? (
          await db.meeting.findMany({
            select: { id: true },
            where: { groupID: meeting.groupID, time: meeting.time },
          })
        ).map(({ id }) => id)
      : [id];

  // prepare checkbox updates
  const changedCheckboxFields: {
    [key: string]: {
      connectOrCreate: {
        where: { code: string };
        create: { code: string };
      }[];
      disconnect: { code: string }[];
    };
  } = {};

  changes
    .filter(({ type }) => type === "checkboxes")
    .forEach(({ field, before, after }) => {
      if (Array.isArray(before) && Array.isArray(after)) {
        const connectOrCreate = after
          .filter((value) => !before.includes(value))
          .map((code: string) => ({ where: { code }, create: { code } }));
        const disconnect = before
          .filter((value) => !after.includes(value))
          .map((code: string) => ({ code }));
        changedCheckboxFields[field] = { connectOrCreate, disconnect };
      }
    });

  for (const meetingID of meetingIDs) {
    // create an activity record
    const activity = await db.activity.create({
      data: {
        type: "update", // todo change this to "updateMeeting"
        meetingID,
        userID,
      },
    });

    // save individual changes
    changes.forEach(
      async ({ field, before, after }) =>
        await db.change.create({
          data: {
            activityID: activity.id,
            before: formatValue(before),
            after: formatValue(after),
            field,
          },
        })
    );

    // update meeting
    const changed = Object.fromEntries(
      changes
        .filter(({ type }) => type !== "checkboxes")
        .map(({ field, after }) => [field, after])
    );

    await db.meeting.update({
      data: { ...changed, ...changedCheckboxFields, updatedAt: new Date() },
      where: { id: meetingID },
    });
  }

  return json({ success: strings.meetings.updated });
};

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  const meeting = await getMeeting(id);
  const { accountID } = await getIDs(request);

  const meetings = await db.meeting.findMany({
    where: { groupID: meeting.group.id, id: { not: id } },
    select: { time: true },
  });

  const saveOptions = [];
  if (meetings.length) {
    saveOptions.push("all");
    if (
      meetings.length !==
      meetings.filter(({ time }) => time === meeting.time).length
    ) {
      saveOptions.push("same_time");
    }
  }

  return jsonWith(request, {
    meeting,
    optionsInUse: await optionsInUse(accountID),
    saveOptions,
  });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.edit,
});

export default function EditMeeting() {
  const { alert, meeting, optionsInUse, saveOptions } = useLoaderData();
  const actionData = useActionData<typeof action>();
  const { accountUrl } = useUser();
  const alerts = { ...alert, ...actionData };

  return (
    <Template
      title={strings.meetings.edit}
      breadcrumbs={[
        ["/groups", strings.group.title],
        [`/groups/${meeting.group.id}`, meeting.group.name],
      ]}
    >
      <Columns
        primary={
          <>
            {alerts && <Alerts data={alerts} />}
            <Form
              form="meeting"
              optionsInUse={optionsInUse}
              saveOptions={saveOptions}
              values={meeting}
            />
          </>
        }
      >
        <div className="flex gap-5 flex-wrap">
          <Button
            icon="external"
            theme="secondary"
            url={formatUrl(accountUrl, meeting.slug)}
          >
            {strings.meetings.view}
          </Button>
          <ArchiveForm archived={meeting.archived} />
        </div>
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
        <Panel
          title={strings.activity.title}
          emptyText={strings.activity.empty}
          rows={meeting.activity.map(
            ({
              changes,
              type,
              user,
              createdAt,
            }: Activity & { changes: Change[]; user: User }) => ({
              user,
              date: createdAt.toString(),
              text: formatString(
                strings.activity.general[
                  type as keyof typeof strings.activity.general
                ],
                formatActivity({ type: "meeting", changes })
              ),
            })
          )}
        />
      </Columns>
    </Template>
  );
}
