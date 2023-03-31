import { User } from "@prisma/client";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Table, Template } from "~/components";
import { formatUpdated } from "~/helpers";
import { strings } from "~/i18n";
import { db } from "~/utils";

export const loader: LoaderFunction = async () => {
  const users = await db.user.findMany();
  return json({ users });
};

export default function Users() {
  const { users } = useLoaderData();
  return (
    <Template title={strings.users}>
      <Table
        columns={{
          name: { label: strings.users_name },
          updatedAt: { label: strings.updated, align: "right" },
        }}
        rows={users.map((user: User) => ({
          ...user,
          updatedAt: formatUpdated(user.updatedAt.toString()),
        }))}
      />
    </Template>
  );
}
