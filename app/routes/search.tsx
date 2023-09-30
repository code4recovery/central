import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { Language, Meeting, Type } from "@prisma/client";
import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useState } from "react";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { Alert, LoadMore, Table, Template } from "~/components";
import {
  config,
  formatDate,
  formatDayTime,
  formatSearch,
  formatString,
} from "~/helpers";
import { strings } from "~/i18n";
import { db, getIDs, searchMeetings, searchGroups } from "~/utils";

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

  const { accountID } = await getIDs(request);

  const search = formatSearch(new URL(request.url).searchParams.get("search"));

  const where = await getSearchWhere({ search, accountID });

  const meetings = await getSearchResults({ where, skip });

  return json(meetings);
};

async function getSearchResults({
  where,
  skip,
}: {
  where: any;
  skip?: number;
}) {
  return await db.meeting.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: {
      archived: true,
      day: true,
      time: true,
      timezone: true,
      name: true,
      updatedAt: true,
      id: true,
      languages: { select: { code: true } },
      types: { select: { code: true } },
    },
    skip,
    take: config.batchSize,
    where,
  });
}

async function getSearchWhere({
  search,
  accountID,
}: {
  search: string;
  accountID: string;
}) {
  return {
    OR: [
      {
        id: {
          in: await searchMeetings(search, accountID),
        },
      },
      {
        groupID: {
          in: await searchGroups(search, accountID),
        },
      },
    ],
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const search = formatSearch(new URL(request.url).searchParams.get("search"));

  const { accountID } = await getIDs(request);

  const where = await getSearchWhere({ search, accountID });

  const loadedMeetings = await getSearchResults({ where });

  const meetingCount = await db.meeting.count({
    where,
  });

  return json({ loadedMeetings, search, meetingCount });
};

export const meta: MetaFunction = () => ({
  title: strings.search.title,
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
      setMeetings((meetings) => [...meetings, ...actionData]);
    }
  }, [actionData]);

  return (
    <Template
      title={strings.search.title}
      description={
        !meetingCount
          ? formatString(strings.search.description_none, { search })
          : meetingCount === 1
          ? formatString(strings.search.description_one, { search })
          : formatString(strings.search.description_many, {
              meetingCount,
              search,
            })
      }
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
          ({
            archived,
            day,
            id,
            languages,
            name,
            time,
            timezone,
            types,
            updatedAt,
          }) => ({
            name: archived ? `${name} (${strings.meetings.archived})` : name,
            id,
            link: `/meetings/${id}`,
            types: [...languages, ...types].map(({ code }) => code),
            updatedAt: formatDate(updatedAt.toString()),
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
