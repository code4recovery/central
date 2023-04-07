import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Meeting } from "@prisma/client";

import { Alert, Button, LoadMore, Table, Template } from "~/components";
import { config, formatDayTime, formatString, formatUpdated } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, searchMeetings } from "~/utils";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { validationError } from "remix-validated-form";

export const action: ActionFunction = async ({ request }) => {
  const validator = withZod(
    z.object({
      skip: zfd.numeric(),
    })
  );

  const { data, error } = await validator.validate(await request.formData());

  if (error) {
    return validationError(error);
  }

  const { skip } = data;

  const meetings = await db.meeting.findMany({
    take: config.batchSize,
    skip: Number(skip),
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
  });
  return json(meetings);
};

export const loader: LoaderFunction = async ({ request }) => {
  const search = new URL(request.url).searchParams.get("search");
  const meetingIDs = await searchMeetings(search);
  const meetings = search
    ? await db.meeting.findMany({
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        where: {
          id: {
            in: meetingIDs,
          },
        },
      })
    : await db.meeting.findMany({
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        take: config.batchSize,
      });
  return json({ meetings, search });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.title,
});

export default function Index() {
  const { meetings: loadedMeetings, search } = useLoaderData();
  const [meetings, setMeetings] = useState(loadedMeetings);
  const actionData = useActionData();
  const { meetingCount } = useUser();

  useEffect(() => {
    if (actionData) {
      setMeetings([...meetings, ...actionData]);
    }
  }, [actionData]);

  return (
    <Template
      title={strings.meetings.title}
      description={formatString(strings.meetings.description, {
        meetingCount,
      })}
      cta={<Button url="/meetings/add" label={strings.meetings.add} />}
    >
      {!meetings.length && (
        <Alert
          message={
            search
              ? formatString(strings.meetings.empty_search, { search })
              : strings.meetings.empty
          }
          type="warning"
        />
      )}
      <Table
        columns={{
          name: { label: strings.meetings.name },
          when: { label: strings.meetings.when },
          types: { label: strings.meetings.types },
          updatedAt: { label: strings.updated, align: "right" },
        }}
        rows={meetings.map((meeting: Meeting) => ({
          ...meeting,
          link: `/meetings/${meeting.id}`,
          updatedAt: formatUpdated(meeting.updatedAt.toString()),
          when: formatDayTime(meeting.day, meeting.time, meeting.timezone),
        }))}
      />
      {!search && meetings.length < meetingCount && (
        <LoadMore loadedCount={meetings.length} totalCount={meetingCount} />
      )}
    </Template>
  );
}
