import type { LoaderFunction } from "@remix-run/node";
import { strings } from "~/i18n";
import { changeAccount, db, getIDs, redirectWith } from "~/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = await getIDs(request);
  const { id: currentAccountID } = params;

  await db.user.update({
    where: { id },
    data: { currentAccountID },
  });

  const account = await db.account.findUnique({
    where: { id: currentAccountID },
  });

  return account
    ? changeAccount(request, account)
    : redirectWith("/", request, { error: strings.account.notFound });
};
