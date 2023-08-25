import type { User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Alerts, Avatar, Button, Chiclet, Table, Template } from "~/components";
import { formatDate } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, jsonWith } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const users = await db.user.findMany({
    orderBy: { lastSeen: "desc" },
    select: {
      id: true,
      canAddUsers: true,
      name: true,
      emailHash: true,
      lastSeen: true,
    },
  });
  return jsonWith(request, { users });
};

export const meta: MetaFunction = () => ({
  title: strings.users.title,
});

export default function Users() {
  const { alert, users } = useLoaderData();
  const { canAddUsers } = useUser();

  return (
    <Template
      title={strings.users.title}
      cta={
        canAddUsers && (
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
            <div className="flex gap-3 items-center">
              <Avatar emailHash={user.emailHash} name={user.name} size="md" />
              {user.name}
            </div>
          ),
          role: user.canAddUsers && <Chiclet>{strings.users.admin}</Chiclet>,
          link: `/users/${user.id}`,
          lastSeen: user.lastSeen
            ? formatDate(user.lastSeen.toString())
            : strings.users.last_seen_never,
        }))}
      />
    </Template>
  );
}
