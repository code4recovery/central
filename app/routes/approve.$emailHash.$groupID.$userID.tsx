import type { LoaderFunction } from "@remix-run/node";
import { db, sendMail } from "~/utils";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { emailHash, groupID, userID } = params;

  // confirm user exists
  await db.user.findUniqueOrThrow({
    where: {
      id: userID,
    },
  });

  const rep = await db.user.findFirstOrThrow({
    select: {
      id: true,
      email: true,
      currentAccountID: true,
    },
    where: {
      emailHash,
    },
  });

  await db.user.update({
    data: { lastSeen: new Date() },
    where: { id: rep.id },
  });

  await db.group.update({
    data: {
      users: {
        connect: { id: userID },
      },
    },
    where: { id: groupID },
  });

  await sendMail({
    to: rep.email,
    subject: "You've been added to a group",
    headline: "You've been added to a group",
    instructions: "You've been added to a group",
    buttonLink: "/",
    buttonText: "Go to your account",
    request,
    currentAccountID: rep.currentAccountID,
  });

  return null;
};

export default function Approve() {
  // todo real page here
  return <div>done thank you</div>;
}
