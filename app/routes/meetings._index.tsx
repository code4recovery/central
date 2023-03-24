import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/node";
import type { ActionArgs, MetaFunction } from "@remix-run/node";
import invariant from "tiny-invariant";

import { Button, Table, Template } from "~/components";
import { config, formatMeetings, formatString } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const meta: MetaFunction = () => ({
  title: strings.meetings_title,
});

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const skip = formData.get("skip");
  invariant(skip && typeof skip === "string");

  const meetings = await db.meeting.findMany({
    take: config.batchSize,
    skip: Number(skip),
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
  });

  return json(formatMeetings(meetings));
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  if (search) {
    const result = await db.meeting.findRaw({
      filter: {
        $text: {
          $search: search.toString(),
        },
      },
    });
  }
  const meetings = await db.meeting.findMany({
    take: config.batchSize,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
  });
  return json(formatMeetings(meetings));
}

export default function Index() {
  const [meetings, setMeetings] = useState(useLoaderData<typeof loader>());
  const more = useActionData();
  const user = useUser();
  const { state } = useNavigation();
  const submitting = state === "submitting";

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
      <Table
        columns={{
          name: { label: strings.meeting_name },
          when: { label: strings.meeting_when },
          types: { label: strings.meeting_types },
          updated: { label: strings.updated, align: "right" },
        }}
        rows={meetings}
      />
      {meetings.length < user.meetingCount && (
        <Form method="post" className="pt-10 flex justify-center">
          <fieldset disabled={submitting}>
            <input type="hidden" name="skip" value={meetings.length} />
            <Button
              label={
                submitting
                  ? strings.loading
                  : formatString(strings.load_more, {
                      count: Math.min(
                        config.batchSize,
                        user.meetingCount - meetings.length
                      ),
                    })
              }
            />
          </fieldset>
        </Form>
      )}
    </Template>
  );
}
