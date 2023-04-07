import { User } from "@prisma/client";
import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button, Chiclet, Table, Template } from "~/components";
import { formatUpdated } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const loader: LoaderFunction = async () => {
  const users = await db.user.findMany();
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
      cta={isAdmin && <Button label={strings.users.add} url="/users/add" />}
    >
      <Table
        columns={{
          name: { label: strings.users.name },
          role: { label: strings.users.role },
          lastSeen: { label: strings.users.last_seen, align: "right" },
        }}
        rows={users.map((user: User) => ({
          ...user,
          role: user.adminAccountIds.includes(currentAccountID) && (
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
