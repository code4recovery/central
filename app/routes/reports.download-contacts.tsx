import type { LoaderFunction } from "@remix-run/node";

import { db } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const groups = await db.group.findMany({
    select: {
      name: true,
      email: true,
      users: { select: { email: true, name: true } },
    },
  });

  const rows: { name: string; email: string }[] = [];

  for (const group of groups) {
    if (group.email) rows.push({ name: group.name, email: group.email });
    for (const user of group.users) {
      rows.push({ name: user.name, email: user.email });
    }
  }

  const csv = `Name,Email\n${rows
    .map(({ name, email }) => `${name},${email}`)
    .join("\n")}`;

  return new Response(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="central-contacts-${new Date().toLocaleDateString()}.csv"`,
      "Content-Type": "application/csv",
    },
  });
};
