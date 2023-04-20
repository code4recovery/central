import type { Activity, Change, User } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import {
  Alerts,
  Button,
  Columns,
  Form,
  HelpTopic,
  Panel,
  PanelRow,
  Template,
} from "~/components";
import { ArchiveForm } from "~/components/ArchiveForm";
import {
  config,
  fields,
  formatChanges,
  formatString,
  formatValidator,
  validObjectId,
} from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, getIDs, jsonWith, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  const meeting = await getMeeting(id);
  const { id: userID, currentAccountID } = await getIDs(request);

  if (!meeting) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }
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
        meetingID: meeting.id,
        type: archived ? "archive" : "unarchive",
        userID,
      },
    });
    try {
      await saveFeedToStorage(currentAccountID);
      return json({ success: strings.meetings.archived });
    } catch (e) {
      if (e instanceof Error) {
        return json({ error: e.message });
      }
    }
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

  // create an activity record
  const activity = await db.activity.create({
    data: {
      type: "update",
      meetingID: id,
      userID,
    },
  });

  // save individual changes
  changes.forEach(
    async ({ field, before, after }) =>
      await db.change.create({
        data: {
          activityID: activity.id,
          before: Array.isArray(before) ? before.join(", ") : `${before}`,
          after: Array.isArray(after) ? after.join(", ") : `${after}`,
          field,
        },
      })
  );

  // prepare checkbox updates
  const changedCheckboxFields: {
    [key: string]: {
      connect: { code: string }[];
      disconnect: { code: string }[];
    };
  } = {};

  changes
    .filter(({ type }) => type === "checkboxes")
    .forEach(({ field, before, after }) => {
      if (Array.isArray(before) && Array.isArray(after)) {
        const connect = after
          .filter((value) => !before.includes(value))
          .map((code: string) => ({ code }));
        const disconnect = before
          .filter((value) => !after.includes(value))
          .map((code: string) => ({ code }));
        changedCheckboxFields[field] = { connect, disconnect };
      }
    });

  // update meeting
  const changed = Object.fromEntries(
    changes
      .filter(({ type }) => type !== "checkboxes")
      .map(({ field, after }) => [field, after])
  );

  await db.meeting.update({
    data: { ...changed, ...changedCheckboxFields, updatedAt: new Date() },
    where: { id },
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

async function getMeeting(id: string) {
  const meeting = await db.meeting.findUnique({
    where: { id },
    include: {
      group: true,
      languages: true,
      types: true,
    },
  });
  return {
    ...meeting,
    languages: meeting?.languages.map(({ code }) => code),
    types: meeting?.types.map(({ code }) => code),
  };
}

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect(config.home); // todo throw 404
  }
  const meeting = await getMeeting(id);
  const { currentAccountID } = await getIDs(request);
  if (!meeting) {
    return redirect(config.home); // todo throw 404
  }
  const activities = await db.activity.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      createdAt: true,
      changes: {
        select: { field: true },
      },
      meeting: {
        select: {
          id: true,
          name: true,
        },
      },
      type: true,
      user: {
        select: {
          name: true,
          emailHash: true,
        },
      },
    },
    take: 5,
    where: { meetingID: meeting.id },
  });

  const languages = await db.language.findMany({
    select: {
      code: true,
    },
    where: {
      meetings: {
        some: {
          group: {
            accountID: currentAccountID,
          },
        },
      },
    },
  });

  const types = await db.type.findMany({
    select: {
      code: true,
    },
    where: {
      meetings: {
        some: {
          group: {
            accountID: currentAccountID,
          },
        },
      },
    },
  });

  const optionsInUse = {
    languages: languages.map(({ code }) => code),
    types: types.map(({ code }) => code),
  };

  return jsonWith(request, { activities, meeting, optionsInUse });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.edit,
});

export default function EditMeeting() {
  const { activities, alert, meeting, optionsInUse } = useLoaderData();
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
            <Form form="meeting" values={meeting} optionsInUse={optionsInUse} />
          </>
        }
      >
        <div className="flex gap-5 flex-wrap">
          <Button
            icon="external"
            secondary
            url={`${accountUrl}?id=${meeting.id}`}
          >
            {strings.meetings.view}
          </Button>
          <Button
            icon="duplicate"
            onClick={() => alert("not implemented yet")}
            secondary
          >
            {strings.meetings.duplicate}
          </Button>
          <ArchiveForm archived={meeting.archived} />
        </div>
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
        <Panel
          title={strings.activity.title}
          emptyText={strings.activity.empty}
        >
          {activities.map(
            ({
              id,
              changes,
              type,
              user,
              createdAt,
            }: Activity & { changes: Change[]; user: User }) => (
              <PanelRow
                key={id}
                user={user}
                date={createdAt.toString()}
                text={formatString(
                  strings.activity.general[
                    type as keyof typeof strings.activity.general
                  ],
                  {
                    properties: changes
                      .map(({ field }) =>
                        fields.meeting[field].label?.toLocaleLowerCase()
                      )
                      .join(", "),
                  }
                )}
              />
            )
          )}
        </Panel>
        <Panel
          title={strings.reports.title}
          emptyText={strings.reports.empty}
        />
      </Columns>
    </Template>
  );
}
