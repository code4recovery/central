import type { Activity, Change, User } from "@prisma/client";
import {
  type ActionFunction,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import {
  Alerts,
  Button,
  Columns,
  DescriptionList,
  Panel,
  Template,
} from "~/components";
import {
  fields,
  formatDate,
  validObjectId,
  formatString,
  formatActivity,
} from "~/helpers";
import { strings } from "~/i18n";
import { db, getIDs, jsonWith, log, publishDataToFtp, sendMail } from "~/utils";

export const action: ActionFunction = async ({
  params: { id: groupID, activityID },
  request,
}) => {
  const formData = await request.formData();
  const { accountID, userID } = await getIDs(request);

  if (formData.get("subaction") === "approve") {
    // get activity
    const activity = await db.activity.findUniqueOrThrow({
      include: { changes: true, group: true, user: true },
      where: { id: activityID },
    });

    // apply updates
    const data: { [id: string]: string | null } = {};
    for (const change of activity.changes) {
      data[change.field as keyof typeof data] = change.after;
    }

    await db.group.update({ data, where: { id: groupID } });

    // update activity
    await db.activity.update({
      data: {
        approved: true,
        approver: { connect: { id: userID } },
        approvedAt: new Date(),
      },
      where: { id: activityID },
    });

    // save feed
    try {
      await publishDataToFtp(accountID);
    } catch (e) {
      if (e instanceof Error) {
        log(e);
        return json({ error: `File storage error: ${e.message}` });
      }
    }

    // notify user
    const { buttonText, headline, instructions, subject } =
      strings.email.update_applied;

    await sendMail({
      accountID,
      buttonLink: `/todo`,
      buttonText,
      headline: formatString(headline, {
        group: activity.group?.name,
      }),
      instructions,
      request,
      subject,
      to: activity.user.email,
    });

    return json({ info: strings.request.approved });
  }

  return null;
};

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    throw new Response(null, {
      status: 404,
      statusText: strings.group.notFound,
    });
  }

  const activity = await db.activity.findUniqueOrThrow({
    select: {
      id: true,
      type: true,
      createdAt: true,
      approved: true,
      approver: {
        select: {
          name: true,
        },
      },
      approvedAt: true,
      changes: {
        select: {
          field: true,
          before: true,
          after: true,
        },
      },
      target: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
      groupID: true,
      meetingID: true,
    },
    where: { id },
  });

  const where = activity.groupID
    ? { groupID: activity.groupID }
    : { meetingID: activity.meetingID };

  const group = activity.groupID
    ? await db.group.findUnique({ where: { id: activity.groupID } })
    : null;

  const meeting = activity.meetingID
    ? await db.meeting.findUnique({
        include: { group: true },
        where: { id: activity.meetingID },
      })
    : null;

  const activities = await db.activity.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      createdAt: true,
      approved: true,
      changes: {
        select: { field: true },
      },
      group: {
        select: {
          id: true,
          name: true,
        },
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
    take: 10,
    where,
  });

  return jsonWith(request, { activities, activity, group, meeting });
};

export default function GroupActivityDetail() {
  const { activities, activity, alert, group, meeting } = useLoaderData();
  const actionData = useActionData();
  const alerts = { ...actionData, ...alert };
  const breadcrumbs = group
    ? [
        ["/groups", strings.group.title],
        [`/groups/${group.id}`, group.name],
      ]
    : meeting
    ? [
        ["/groups", strings.group.title],
        [`/groups/${meeting.group.id}`, meeting.group.name],
        [`/meetings/${meeting.id}`, meeting.name],
      ]
    : [];
  const isRequest = activity.type.startsWith("request");
  const isPending = isRequest && typeof activity.approved === "undefined";
  return (
    <Template
      breadcrumbs={breadcrumbs}
      title={formatString(
        strings.activity.general[
          activity.type as keyof typeof strings.activity.general
        ],
        formatActivity({ ...activity, type: group ? "group" : "meeting" })
      )}
    >
      <Columns
        primary={
          <div className="px-4 sm:px-0 grid gap-y-4">
            {alerts && <Alerts data={alerts} />}
            <DescriptionList
              terms={[
                {
                  term: isRequest
                    ? strings.activity.changeRequested
                    : strings.activity.changeApplied,
                  definition: [
                    activity.user.name,
                    formatDate(activity.createdAt),
                  ].join(", "),
                },
                ...activity.changes.map(({ field, before, after }: Change) => ({
                  term: group
                    ? fields.group[field]?.label
                    : fields.meeting[field]?.label,
                  definition: [before, after],
                })),
                ...(activity.type === "add"
                  ? [
                      {
                        term: strings.activity.general.add,
                        definition: activity.target.name,
                      },
                    ]
                  : []),
                ...(isRequest
                  ? [
                      {
                        term: strings.activity.status,
                        definition:
                          activity.approved === true
                            ? formatString(strings.activity.approvedBy, {
                                user: activity.approver.name,
                                date: formatDate(activity.approvedAt),
                              })
                            : activity.approved === false
                            ? formatString(strings.activity.declinedBy, {
                                user: activity.approver.name,
                                date: formatDate(activity.declinedAt),
                              })
                            : strings.pending,
                      },
                    ]
                  : []),
              ]}
            />

            {isPending && (
              <Form className="flex justify-center gap-3" method="post">
                <input type="hidden" name="subaction" value="approve" />
                <Button theme="primary">{strings.activity.approve}</Button>
                <Button theme="secondary">{strings.activity.decline}</Button>
              </Form>
            )}
          </div>
        }
      >
        <Panel
          emptyText={strings.activity.empty}
          rows={activities.map(
            ({
              approved,
              id,
              changes,
              type,
              user,
              createdAt,
            }: Activity & { changes: Change[]; user: User }) => ({
              active: id === activity.id,
              user,
              date: createdAt.toString(),
              link: `/activity/${id}`,
              text: formatString(
                strings.activity.general[
                  type as keyof typeof strings.activity.general
                ],
                formatActivity({
                  type: group ? "group" : "meeting",
                  approved,
                  changes,
                })
              ),
            })
          )}
          title={strings.activity.title}
        />
      </Columns>
    </Template>
  );
}
