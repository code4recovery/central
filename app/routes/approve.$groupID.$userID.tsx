import type { LoaderFunction } from "@remix-run/node";
import { db, getIDs, sendMail } from "~/utils";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = await getIDs(request);

  const { groupID, userID } = params;

  // confirm rep exists
  const rep = await db.user.findUniqueOrThrow({
    select: {
      id: true,
      email: true,
      currentAccountID: true,
    },
    where: {
      id,
    },
  });

  // this counts as "last seen"
  await db.user.update({
    data: { lastSeen: new Date() },
    where: { id: rep.id },
  });

  // approve request
  await db.group.update({
    data: {
      users: {
        connect: { id: userID },
      },
    },
    where: { id: groupID },
  });

  // save activity
  await db.activity.create({
    data: {
      groupID: groupID,
      type: "add", // todo change this to "addUser" - also change the activity type in the db
      userID: rep.id,
      targetID: userID,
    },
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
