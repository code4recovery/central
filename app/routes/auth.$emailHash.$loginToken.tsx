import { LoaderFunction } from "@remix-run/node";

import { config } from "~/helpers";
import { createUserSession, db } from "~/utils";

export const loader: LoaderFunction = async ({ params }) => {
  const { loginToken, emailHash, go } = params;

  const user = await db.user.findFirst({
    where: {
      emailHash,
      loginToken,
    },
  });

  if (user) {
    return await createUserSession(user.id, go ?? config.home);
  }

  return null;
};

export default function In() {
  return <div>sorry, something went wrong.</div>;
}
