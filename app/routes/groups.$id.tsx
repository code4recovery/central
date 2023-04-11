import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useLoaderData } from "@remix-run/react";
import { Language, Meeting, Type } from "@prisma/client";

import {
  fields,
  formatDayTime,
  formatUpdated,
  formatValidator,
  validObjectId,
} from "~/helpers";
import { Columns, Form, Panel, Table, Template } from "~/components";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  const group = await getGroup(id);

  if (!group) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  const validator = formatValidator("group");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  return null;
};

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  const group = await getGroup(id);

  if (!group) {
    return redirect("/meetings"); // todo flash invalid id message to this page
  }

  return json({ group });
};

async function getGroup(id: string) {
  return await db.group.findUnique({
    where: { id },
    select: {
      ...Object.fromEntries(
        Object.keys(fields.group).map((field) => [field, true])
      ),
      meetings: {
        include: { languages: true, types: true },
      },
    },
  });
}

export default function GroupEdit() {
  const { group } = useLoaderData();
  return (
    <Template breadcrumbs={[["/groups", "Groups"]]} title="Edit group">
      <Columns
        primary={
          <>
            <Form form="group" values={group} />
            <Table
              columns={{
                name: { label: strings.meetings.name },
                when: { label: strings.meetings.when },
                types: { label: strings.meetings.types },
                updatedAt: { label: strings.updated, align: "right" },
              }}
              rows={group.meetings.map(
                ({
                  name,
                  id,
                  updatedAt,
                  day,
                  languages,
                  time,
                  timezone,
                  types,
                }: Meeting & { languages: Language[]; types: Type[] }) => ({
                  name,
                  id,
                  link: `/meetings/${id}`,
                  types: [...languages, ...types].map(({ code }) => code),
                  updatedAt: formatUpdated(updatedAt.toString()),
                  when: formatDayTime(day, time, timezone),
                })
              )}
            />
          </>
        }
      >
        <Panel title="Representatives" emptyText="No representatives yet" />
      </Columns>
    </Template>
  );
}
