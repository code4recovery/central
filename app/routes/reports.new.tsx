import type { Language, Meeting, Type } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { Alert, LoadMore, Table, Template } from "~/components";
import { config, formatDate, formatDayTime, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db, getIDs } from "~/utils";

// shared where condition
const where = {
  archived: false,
  createdAt: { gte: DateTime.now().minus({ week: 1 }).toJSDate() },
};

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

  const { currentAccountID } = await getIDs(request);

  const meetings = await db.meeting.findMany({
    select: {
      day: true,
      time: true,
      timezone: true,
      name: true,
      updatedAt: true,
      id: true,
      languages: { select: { code: true } },
      types: { select: { code: true } },
    },
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip,
    take: config.batchSize,
    where: { ...where, accountID: currentAccountID },
  });
  return json(meetings);
};

export const loader: LoaderFunction = async ({ request }) => {
  const { currentAccountID } = await getIDs(request);

  const loadedMeetings = await db.meeting.findMany({
    select: {
      id: true,
      name: true,
      day: true,
      time: true,
      timezone: true,
      updatedAt: true,
      languages: { select: { code: true } },
      types: { select: { code: true } },
    },
    take: config.batchSize,
    where: { ...where, accountID: currentAccountID },
  });

  const meetingCount = await db.meeting.count({
    where: { ...where, accountID: currentAccountID },
  });

  return json({ loadedMeetings, meetingCount });
};

export const meta: MetaFunction = () => ({
  title: strings.reports.title,
});

export default function NewMeetings() {
  const { loadedMeetings, meetingCount } = useLoaderData<typeof loader>();
  const [meetings, setMeetings] =
    useState<Array<Meeting & { types: Type[]; languages: Language[] }>>(
      loadedMeetings
    );

  const actionData = useActionData();

  useEffect(() => {
    if (actionData) {
      setMeetings((meetings) => [...meetings, ...actionData]);
    }
  }, [actionData]);

  return (
    <Template
      title={strings.reports.new.title}
      description={formatString(strings.reports.new.description, {
        count: meetingCount,
      })}
    >
      {!meetingCount && (
        <Alert message={strings.reports.new.empty} type="info" />
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
            updatedAt: formatDate(updatedAt.toString()),
            when: formatDayTime(day, time, timezone),
          })
        )}
      />
      {meetings.length < meetingCount && (
        <LoadMore loadedCount={meetings.length} totalCount={meetingCount} />
      )}
    </Template>
  );
}
