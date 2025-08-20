import type { LoaderFunction } from "@remix-run/node";
import { changeAccount, db, getIDs, getStrings, redirectWith } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userID } = await getIDs(request);
  const { id: currentAccountID } = params;
  const strings = await getStrings(request);

  await db.user.update({
    where: { id: userID },
    data: { currentAccountID },
  });

  const account = await db.account.findUnique({
    where: { id: currentAccountID },
  });

  return account
    ? changeAccount(request, account)
    : redirectWith("/", request, { error: strings.account.notFound });
};
