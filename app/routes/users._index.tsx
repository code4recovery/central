import { User } from "@prisma/client";
import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Avatar, Button, Chiclet, Table, Template } from "~/components";
import { formatUpdated } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, getUser } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const { currentAccountID } = await getUser(request);
  const users = await db.user.findMany({
    orderBy: { lastSeen: "desc" },
    select: {
      id: true,
      adminAccountIDs: true,
      name: true,
      emailHash: true,
      lastSeen: true,
    },
    where: { accountIDs: { has: currentAccountID } },
  });
  return json({ users });
};

export const meta: MetaFunction = () => ({
  title: strings.users.title,
});

export default function Users() {
  const { users } = useLoaderData();
  const { currentAccountID, isAdmin } = useUser();
  return (
    <Template
      title={strings.users.title}
      cta={isAdmin && <Button url="/users/add">{strings.users.add}</Button>}
    >
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
          role: user.adminAccountIDs.includes(currentAccountID) && (
            <Chiclet>{strings.users.admin}</Chiclet>
          ),
          link: `/users/${user.id}`,
          lastSeen: user.lastSeen
            ? formatUpdated(user.lastSeen.toString())
            : strings.users.last_seen_never,
        }))}
      />
    </Template>
  );
}
