import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Language, Meeting, Type } from "@prisma/client";

import { Alert, Button, LoadMore, Table, Template } from "~/components";
import { config, formatDayTime, formatString, formatUpdated } from "~/helpers";
import { strings } from "~/i18n";
import { db, getUser, searchMeetings } from "~/utils";
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

  const { currentAccountID } = await getUser(request);

  const meetings = await db.meeting.findMany({
    include: { types: true, languages: true },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: Number(skip),
    take: config.batchSize,
    where: { accountID: currentAccountID },
  });
  return json(meetings);
};

export const loader: LoaderFunction = async ({ request }) => {
  const search = new URL(request.url).searchParams.get("search");
  const meetingIDs = await searchMeetings(search);
  const { currentAccountID } = await getUser(request);
  const meetingCount = await db.meeting.count({
    where: { accountID: currentAccountID },
  });
  const loadedMeetings = search
    ? await db.meeting.findMany({
        include: { types: true, languages: true },
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        where: {
          id: {
            in: meetingIDs,
          },
          accountID: currentAccountID,
        },
      })
    : await db.meeting.findMany({
        orderBy: [{ updatedAt: "desc" }],
        take: config.batchSize,
        include: { types: true, languages: true },
        where: { accountID: currentAccountID },
      });
  return json({ loadedMeetings, search, meetingCount });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.title,
});

export default function Index() {
  const { loadedMeetings, search, meetingCount } =
    useLoaderData<typeof loader>();
  const [meetings, setMeetings] =
    useState<Array<Meeting & { types: Type[]; languages: Language[] }>>(
      loadedMeetings
    );
  const actionData = useActionData();

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
          type="info"
        />
      )}
      <Table
        columns={{
          name: { label: strings.meetings.name },
          when: { label: strings.meetings.when },
          types: { label: strings.meetings.types },
          updatedAt: { label: strings.updated, align: "right" },
        }}
        rows={meetings.map(
          ({ name, id, updatedAt, day, languages, time, timezone, types }) => ({
            name,
            id,
            link: `/meetings/${id}`,
            types: [...languages, ...types].map(({ code }) => code),
            updatedAt: formatUpdated(updatedAt.toString()),
            when: formatDayTime(day, time, timezone),
          })
        )}
      />
      {!search && meetings.length < meetingCount && (
        <LoadMore loadedCount={meetings.length} totalCount={meetingCount} />
      )}
    </Template>
  );
}
