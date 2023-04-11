import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Group, Language, Meeting, Type } from "@prisma/client";

import { Alert, Button, LoadMore, Table, Template } from "~/components";
import { config, formatDayTime, formatString, formatUpdated } from "~/helpers";
import { strings } from "~/i18n";
import { db, getUser, searchGroups } from "~/utils";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { validationError } from "remix-validated-form";

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

  const { currentAccountID } = await getUser(request);

  const groups = await db.group.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: Number(skip),
    take: config.batchSize,
    where: { accountID: currentAccountID },
  });
  return json(groups);
};

export const loader: LoaderFunction = async ({ request }) => {
  const search = new URL(request.url).searchParams.get("search");
  const groupIDs = await searchGroups(search);
  const { currentAccountID } = await getUser(request);
  const groupCount = await db.group.count({
    where: { accountID: currentAccountID },
  });
  const loadedGroups = search
    ? await db.group.findMany({
        orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
        where: {
          id: {
            in: groupIDs,
          },
          accountID: currentAccountID,
        },
      })
    : await db.group.findMany({
        orderBy: [{ updatedAt: "desc" }],
        take: config.batchSize,
        where: { accountID: currentAccountID },
      });
  return json({ loadedGroups, search, groupCount });
};

export const meta: MetaFunction = () => ({
  title: strings.group.title,
});

export default function Index() {
  const { loadedGroups, search, groupCount } = useLoaderData<typeof loader>();
  const [groups, setGroups] = useState<Array<Group>>(loadedGroups);
  const actionData = useActionData();

  useEffect(() => {
    if (actionData) {
      setGroups([...groups, ...actionData]);
    }
  }, [actionData]);

  return (
    <Template
      title={strings.group.title}
      description={formatString(strings.group.description, {
        groupCount,
      })}
      cta={<Button url="/groups/add">{strings.group.add}</Button>}
    >
      {!groups.length && (
        <Alert
          message={
            search
              ? formatString(strings.group.empty_search, { search })
              : strings.group.empty
          }
          type="info"
        />
      )}
      <Table
        columns={{
          name: { label: strings.group.name },
          updatedAt: { label: strings.updated, align: "right" },
        }}
        rows={groups.map(({ name, id, updatedAt }) => ({
          name,
          id,
          link: `/groups/${id}`,
          updatedAt: formatUpdated(updatedAt.toString()),
        }))}
      />
      {!search && groups.length < groupCount && (
        <LoadMore loadedCount={groups.length} totalCount={groupCount} />
      )}
    </Template>
  );
}
