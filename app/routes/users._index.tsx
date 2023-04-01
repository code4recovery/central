import { User } from "@prisma/client";
import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button, Table, Template } from "~/components";
import { formatUpdated } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const loader: LoaderFunction = async () => {
  const users = await db.user.findMany();
  return json({ users });
};

export const meta: MetaFunction = () => ({
  title: strings.users,
});

export default function Users() {
  const { users } = useLoaderData();
  return (
    <Template
      title={strings.users}
      cta={<Button label={strings.user_add} url="/users/add" />}
    >
      <Table
        columns={{
          name: { label: strings.users_name },
          role: { label: strings.users_role },
          lastSeen: { label: strings.users_last_seen, align: "right" },
        }}
        rows={users.map((user: User) => ({
          ...user,
          role: "Admin",
          link: `/users/${user.id}`,
          lastSeen: user.lastSeen
            ? formatUpdated(user.lastSeen.toString())
            : strings.users_last_seen_never,
        }))}
      />
    </Template>
  );
}
