import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { Language, Meeting, Type } from "@prisma/client";
import { useActionData, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";

import { Alert, LoadMore, Table, Template } from "~/components";
import {
  config,
  formatDate,
  formatDayTime,
  formatSearch,
  formatString,
} from "~/helpers";
import { strings } from "~/i18n";
import {
  db,
  getIDs,
  redirectWith,
  searchMeetings,
  searchGroups,
} from "~/utils";

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
  const searchTerms = formatSearch(search);

  return {
    OR: [
      {
        id: {
          in: await searchMeetings(searchTerms, accountID),
        },
      },
      {
        groupID: {
          in: await searchGroups(searchTerms, accountID),
        },
      },
    ],
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const search = (
    new URL(request.url).searchParams.get("search") ?? ""
  ).replace(/['"]+/g, "");

  if (!search) {
    return redirect("/", request);
  }

  const { accountID } = await getIDs(request);

  const where = await getSearchWhere({ search, accountID });

  const loadedMeetings = await getSearchResults({ where });

  if (loadedMeetings.length === 1) {
    return redirectWith(`/meetings/${loadedMeetings[0].id}`, request, {
      info: formatString(strings.search.description_one, { search }),
    });
  }

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
          ? ""
          : formatString(strings.search.description_many, {
              meetingCount,
              search,
            })
      }
    >
      {!meetingCount && (
        <Alert
          message={
            search
              ? formatString(strings.search.description_none, { search })
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
      {meetings.length < meetingCount && (
        <LoadMore loadedCount={meetings.length} totalCount={meetingCount} />
      )}
    </Template>
  );
}
