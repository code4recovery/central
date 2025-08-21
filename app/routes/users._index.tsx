import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Alerts, Avatar, Button, Chiclet, Table, Template } from "~/components";
import { formatDate } from "~/helpers";
import { useTranslation, useUser } from "~/hooks";
import { en } from "~/i18n";
import { db, getIDs, jsonWith } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const { accountID } = await getIDs(request);
  const users = await db.user.findMany({
    orderBy: { lastSeen: "desc" },
    select: {
      id: true,
      adminAccountIDs: true,
      name: true,
      emailHash: true,
      lastSeen: true,
    },
    where: { accountIDs: { has: accountID } },
  });
  return jsonWith(request, { users });
};

export const meta: MetaFunction = () => ({
  title: en.users.title,
});

export default function Users() {
  const { alert, users } = useLoaderData();
  const { currentAccountID, isAdmin } = useUser();
  const strings = useTranslation();

  return (
    <Template
      title={strings.users.title}
      cta={
        isAdmin && (
          <Button url="/users/add" theme="primary">
            {strings.users.add}
          </Button>
        )
      }
    >
      {alert && <Alerts data={alert} />}
      <Table
        columns={{
          name: { label: strings.users.name },
          role: { label: strings.users.role },
          lastSeen: { label: strings.users.last_seen, align: "right" },
        }}
        rows={users.map((user: User) => ({
          ...user,
          name: (
            <div className="flex items-center gap-3">
              <Avatar emailHash={user.emailHash} name={user.name} size="md" />
              {user.name}
            </div>
          ),
          role: user.adminAccountIDs.includes(currentAccountID) && (
            <Chiclet>{strings.users.admin}</Chiclet>
          ),
          link: `/users/${user.id}`,
          lastSeen: user.lastSeen
            ? formatDate(user.lastSeen.toString())
            : strings.users.last_seen_never,
        }))}
      />
    </Template>
  );
}
