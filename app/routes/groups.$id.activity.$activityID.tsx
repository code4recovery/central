import type { Activity, Change, User } from "@prisma/client";
import { type LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import {
  Alerts,
  Button,
  Columns,
  DescriptionList,
  Panel,
  Template,
} from "~/components";
import { fields, formatDate, validObjectId, formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db, jsonWith } from "~/utils";

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
    take: 12,
    where: { groupID: id },
  });

  const activity = await db.activity.findUniqueOrThrow({
    select: {
      id: true,
      type: true,
      createdAt: true,
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

  console.log(activity);

  return jsonWith(request, { activities, activity, group });
};

export default function GroupEdit() {
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
        {
          properties: activity.changes
            .map(({ field }: Change) =>
              fields.group[field].label?.toLocaleLowerCase()
            )
            .join(", "),
        }
      )}
    >
      <Columns
        primary={
          <>
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
              ]}
            />
            <Form>
              <Button theme="primary">{strings.activity.revert}</Button>
            </Form>
          </>
        }
      >
        <Panel
          emptyText={strings.activity.empty}
          rows={activities.map(
            ({
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
                {
                  properties: changes
                    .map(({ field }) =>
                      fields.group[field].label?.toLocaleLowerCase()
                    )
                    .join(", "),
                }
              ),
            })
          )}
          title={strings.activity.title}
        />
      </Columns>
    </Template>
  );
}
