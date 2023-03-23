import { useContext, useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionArgs, MetaFunction } from "@remix-run/node";
import invariant from "tiny-invariant";

import { Button, Table, Template } from "~/components";
import { UserContext } from "~/contexts";
import { config, formatMeetings, formatString } from "~/helpers";
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

export async function loader() {
  const meetings = await db.meeting.findMany({
    take: config.batchSize,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
  });
  return json(formatMeetings(meetings));
}

export default function Index() {
  const [meetings, setMeetings] = useState(useLoaderData<typeof loader>());
  const more = useActionData();
  const user = useContext(UserContext);
  const { state } = useNavigation();
  const submitting = state === "submitting";

  useEffect(() => {
    if (more) {
      setMeetings([...meetings, ...more]);
    }
  }, [more]);

  if (!user) return null;

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
          timezone: { label: strings.meeting_timezone },
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
                      count: config.batchSize,
                    })
              }
            />
          </fieldset>
        </Form>
      )}
    </Template>
  );
}
