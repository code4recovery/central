import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import { Alert, Button, LoadMore, Table, Template } from "~/components";
import { config, formatMeetings, formatString } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, searchMeetings } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const skip = formData.get("skip");
  const meetings = await db.meeting.findMany({
    take: config.batchSize,
    skip: skip ? Number(skip) : undefined,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
  });
  return json(formatMeetings(meetings));
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
  return json({ loadedMeetings: formatMeetings(meetings), search });
};

export const meta: MetaFunction = () => ({
  title: strings.meetings_title,
});

export default function Index() {
  const { loadedMeetings, search } = useLoaderData<typeof loader>();
  const [meetings, setMeetings] = useState(loadedMeetings);
  const more = useActionData();
  const user = useUser();

  useEffect(() => {
    if (more) {
      setMeetings([...meetings, ...more]);
    }
  }, [more]);

  return (
    <Template
      title={strings.meetings_title}
      description={formatString(strings.meetings_description, {
        meetings_count: user.meetingCount,
      })}
      cta={<Button url="/meetings/add" label={strings.meeting_add} />}
    >
      {!meetings.length && (
        <Alert
          message={
            search
              ? formatString(strings.meetings_none_search, { search })
              : strings.meetings_none
          }
          type="warning"
        />
      )}
      <Table
        columns={{
          name: { label: strings.meeting_name },
          when: { label: strings.meeting_when },
          types: { label: strings.meeting_types },
          updated: { label: strings.updated, align: "right" },
        }}
        rows={meetings}
      />
      {!search && meetings.length < user.meetingCount && (
        <LoadMore
          loadedCount={meetings.length}
          totalCount={user.meetingCount}
        />
      )}
    </Template>
  );
}
