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
import { db, getIDs, jsonWith, sendMail } from "~/utils";

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
    const data = {};
    for (const change of activity.changes) {
      // @ts-ignore todo
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

export const loader: LoaderFunction = async ({
  params: { id, activityID },
  request,
}) => {
  if (!validObjectId(id)) {
    throw new Response(null, {
      status: 404,
      statusText: strings.group.notFound,
    });
  }

  const group = await db.group.findUniqueOrThrow({
    select: {
      id: true,
      name: true,
    },
    where: { id },
  });

  const activities = await db.activity.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      createdAt: true,
      approved: true,
      changes: {
        select: { field: true },
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
    where: { groupID: id },
  });

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
    },
    where: { id: activityID },
  });

  return jsonWith(request, { activities, activity, group });
};

export default function GroupActivityDetail() {
  const { activities, activity, alert, group } = useLoaderData();
  const actionData = useActionData();
  const alerts = { ...actionData, ...alert };
  return (
    <Template
      breadcrumbs={[
        ["/groups", strings.group.title],
        [`/groups/${group.id}`, group.name],
      ]}
      title={formatString(
        strings.activity.general[
          activity.type as keyof typeof strings.activity.general
        ],
        formatActivity({ ...activity, type: "group" })
      )}
    >
      <Columns
        primary={
          <div className="px-4 sm:px-0 grid gap-y-4">
            {alerts && <Alerts data={alerts} />}
            <DescriptionList
              terms={[
                {
                  term: "Change made",
                  definition: `${activity.user.name} ~ ${formatDate(
                    activity.createdAt
                  )}`,
                },
                ...activity.changes.map(({ field, before, after }: Change) => ({
                  term: fields.group[field].label,
                  definition: `${before} → ${after}`,
                })),
                ...(activity.type === "add"
                  ? [
                      {
                        term: strings.activity.general.add,
                        definition: activity.target.name,
                      },
                    ]
                  : []),
                ...(activity.type === "requestGroupUpdate"
                  ? [
                      {
                        term: strings.activity.general.approved,
                        definition:
                          activity.approved === true
                            ? strings.yes
                            : activity.approved === false
                            ? strings.no
                            : strings.pending,
                      },
                    ]
                  : []),
              ]}
            />
            <Form className="flex justify-center gap-3" method="post">
              <input type="hidden" name="subaction" value="approve" />
              <Button theme="primary">{strings.activity.approve}</Button>
              <Button theme="secondary">{strings.activity.decline}</Button>
            </Form>
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
              link: `/groups/${group.id}/activity/${id}`,
              text: formatString(
                strings.activity.general[
                  type as keyof typeof strings.activity.general
                ],
                formatActivity({ type: "group", approved, changes })
              ),
            })
          )}
          title={strings.activity.title}
        />
      </Columns>
    </Template>
  );
}
