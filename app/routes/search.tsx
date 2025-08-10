import type { Group, Language, Meeting, Type } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Alert, LoadMore, Table, Template } from "~/components";
import {
  config,
  formatClasses as cx,
  formatDate,
  formatDayTime,
  formatSearch,
  formatString,
} from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import {
  db,
  getIDs,
  redirectWith,
  searchGroups,
  searchMeetings,
} from "~/utils";

// load 25 more
export const action: ActionFunction = async ({ request }) => {
  const validator = withZod(
    z.object({
      skip: zfd.numeric(),
    }),
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
      group: { select: { id: true, name: true, recordID: true } },
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
  const {
    theme: { text },
  } = useUser();
  const { loadedMeetings, search, meetingCount } =
    useLoaderData<typeof loader>();
  const [meetings, setMeetings] = useState<
    Array<
      Meeting & {
        types: Type[];
        languages: Language[];
        group: Partial<Group>;
      }
    >
  >(loadedMeetings);
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
          group: { label: strings.group.name },
          updatedAt: { label: strings.updated, align: "right" },
        }}
        rows={meetings.map(
          ({
            archived,
            day,
            id,
            name,
            time,
            timezone,
            updatedAt,
            group: { id: groupID, recordID, name: groupName },
          }) => ({
            name: (
              <Link
                to={`/meetings/${id}`}
                className={cx(text, "font-semibold", {
                  underline: !archived,
                  "line-through opacity-75": archived,
                })}
              >
                {archived && (
                  <ArchiveBoxIcon className="mr-1 inline-block h-4 w-4" />
                )}
                {name}
              </Link>
            ),
            id,
            group: (
              <div className="flex items-center gap-3">
                <span className="min-w-[80px] rounded border border-neutral-400 px-3 py-1 text-center font-mono text-sm dark:border-neutral-700">
                  #{recordID}
                </span>
                <Link
                  to={`/groups/${groupID}`}
                  className={cx(text, "font-semibold underline")}
                >
                  {groupName}
                </Link>
              </div>
            ),
            updatedAt: formatDate(updatedAt.toString()),
            when: formatDayTime(day, time, timezone),
          }),
        )}
      />
      {meetings.length < meetingCount && (
        <LoadMore loadedCount={meetings.length} totalCount={meetingCount} />
      )}
    </Template>
  );
}
