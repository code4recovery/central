import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";

import { Alerts, Button, Template } from "~/components";
import { db } from "~/utils";

type Report = {
  entity: string;
  connected: number;
  disconnected: number;
};

// used both by leader and action
const getData = async () => {
  const accounts = await db.account.findMany({ select: { id: true } });
  const accountIds = accounts.map(({ id }) => id);

  const [validGroups, validMeetings] = await Promise.all([
    db.group.findMany({
      select: { id: true },
      where: { account: { id: { in: accountIds } } },
    }),
    db.meeting.findMany({
      select: { id: true },
      where: { account: { id: { in: accountIds } } },
    }),
  ]);
  const validGroupIds = validGroups.map(({ id }) => id);
  const validMeetingIds = validMeetings.map(({ id }) => id);

  const validUsers = await db.user.findMany({
    select: { id: true },
    where: {
      OR: [
        { accounts: { some: { id: { in: accountIds } } } },
        { groups: { some: { id: { in: validGroupIds } } } },
      ],
    },
  });
  const validUserIds = validUsers.map(({ id }) => id);

  const validActivity = await db.activity.findMany({
    select: { id: true },
    where: {
      AND: [{ user: { id: { in: validUserIds } } }],
      OR: [
        { group: { id: { in: validGroupIds } } },
        { meeting: { id: { in: validMeetingIds } } },
      ],
    },
  });
  const validActivityIds = validActivity.map(({ id }) => id);

  const validChanges = await db.change.findMany({
    select: { id: true, field: true },
    where: { activityID: { in: validActivityIds } },
  });
  const validChangeIds = validChanges.map(({ id }) => id);

  const [languages, types] = await Promise.all([
    db.language.findMany({
      select: { id: true, code: true },
      where: { meetings: { some: { id: { in: validMeetingIds } } } },
    }),
    db.type.findMany({
      select: { id: true, code: true },
      where: { meetings: { some: { id: { in: validMeetingIds } } } },
    }),
  ]);
  const validLanguageIds = languages.map(({ id }) => id);
  const validTypeIds = types.map(({ id }) => id);

  return {
    validGroupIds,
    validUserIds,
    validMeetingIds,
    validActivityIds,
    validChangeIds,
    validLanguageIds,
    validTypeIds,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  const entity = formData.get("entity");

  const {
    validGroupIds,
    validUserIds,
    validMeetingIds,
    validActivityIds,
    validChangeIds,
    validLanguageIds,
    validTypeIds,
  } = await getData();

  // Perform cleanup based on the entity
  switch (entity) {
    case "groups":
      await db.group.deleteMany({
        where: { id: { notIn: validGroupIds } },
      });
      break;
    case "users":
      await db.user.deleteMany({
        where: { id: { notIn: validUserIds } },
      });
      break;
    case "meetings":
      await db.meeting.deleteMany({
        where: { id: { notIn: validMeetingIds } },
      });
      break;
    case "activities":
      await db.activity.deleteMany({
        where: { id: { notIn: validActivityIds } },
      });
      break;
    case "changes":
      await db.change.deleteMany({
        where: { id: { notIn: validChangeIds } },
      });
      break;
    case "languages":
      await db.language.deleteMany({
        where: { id: { notIn: validLanguageIds } },
      });
      return json({ success: "Languages cleaned up" });
    case "types":
      await db.type.deleteMany({
        where: { id: { notIn: validTypeIds } },
      });
      return json({ success: "Types cleaned up" });
  }

  return null;
};

export const loader: LoaderFunction = async () => {
  const reports: Report[] = [];

  const {
    validGroupIds,
    validUserIds,
    validMeetingIds,
    validActivityIds,
    validChangeIds,
    validLanguageIds,
    validTypeIds,
  } = await getData();

  // groups
  const invalidGroupCount = await db.group.count({
    where: { id: { notIn: validGroupIds } },
  });
  reports.push({
    entity: "groups",
    connected: validGroupIds.length,
    disconnected: invalidGroupCount,
  });

  // users
  const invalidUserCount = await db.user.count({
    where: { id: { notIn: validUserIds } },
  });
  reports.push({
    entity: "users",
    connected: validUserIds.length,
    disconnected: invalidUserCount,
  });

  // meetings
  const invalidMeetingCount = await db.meeting.count({
    where: { id: { notIn: validMeetingIds } },
  });
  reports.push({
    entity: "meetings",
    connected: validMeetingIds.length,
    disconnected: invalidMeetingCount,
  });

  // activity
  const invalidActivityCount = await db.activity.count({
    where: { id: { notIn: validActivityIds } },
  });
  reports.push({
    entity: "activities",
    connected: validActivityIds.length,
    disconnected: invalidActivityCount,
  });

  // change
  const invalidChangeCount = await db.change.count({
    where: { id: { notIn: validChangeIds } },
  });
  reports.push({
    entity: "changes",
    connected: validChangeIds.length,
    disconnected: invalidChangeCount,
  });

  // language
  const invalidLanguageCount = await db.language.count({
    where: { id: { notIn: validLanguageIds } },
  });
  reports.push({
    entity: "languages",
    connected: validLanguageIds.length,
    disconnected: invalidLanguageCount,
  });

  // type
  const invalidTypeCount = await db.type.count({
    where: { id: { notIn: validTypeIds } },
  });
  reports.push({
    entity: "types",
    connected: validTypeIds.length,
    disconnected: invalidTypeCount,
  });

  reports.sort((a, b) => b.disconnected - a.disconnected);

  return reports;
};

export default function Cleanup() {
  const reports = useLoaderData<Report[]>();
  const actionData = useActionData();
  const { state } = useNavigation();
  return (
    <Template
      title="Cleanup"
      description="Remove disconnected data from the database"
    >
      {actionData && state === "idle" && <Alerts data={actionData} />}
      <div className="grid items-start gap-5 px-4 sm:grid-cols-2 sm:px-0 md:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.entity}
            className="grid justify-start gap-4 rounded bg-white p-5 dark:bg-neutral-950"
          >
            <h2 className="text-2xl font-bold uppercase">{report.entity}</h2>
            <article className="grid gap-1">
              <p>connected: {report.connected}</p>
              <p>disconnected: {report.disconnected}</p>
            </article>
            {report.disconnected > 0 && (
              <form className="mt-1" method="post">
                <input type="hidden" name="entity" value={report.entity} />
                <Button theme="secondary" icon="delete">
                  clean up
                </Button>
              </form>
            )}
          </div>
        ))}
      </div>
    </Template>
  );
}
