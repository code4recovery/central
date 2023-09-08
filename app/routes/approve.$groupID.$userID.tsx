import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Message } from "~/components";
import { formatString } from "~/helpers";
import { strings } from "~/i18n";
import { db, getIDs, sendMail } from "~/utils";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id: repID } = await getIDs(request);

  const { groupID, userID } = params;

  // confirm requesting user exists
  const user = await db.user.findUniqueOrThrow({
    select: {
      currentAccountID: true,
      email: true,
      emailHash: true,
      id: true,
      loginToken: true,
      name: true,
    },
    where: {
      id: userID,
    },
  });

  // get the group name for the email and page
  const group = await db.group.findUniqueOrThrow({
    select: {
      name: true,
      recordID: true,
      userIDs: true,
    },
    where: {
      id: groupID,
    },
  });

  if (!group.userIDs.includes(user.id)) {
    // approve request
    await db.group.update({
      data: {
        users: {
          connect: { id: user.id },
        },
      },
      where: { id: groupID },
    });

    // save activity
    await db.activity.create({
      data: {
        groupID,
        type: "add", // todo change this to "addGroupRep"
        userID: repID,
        targetID: user.id,
      },
    });

    const { buttonText, headline, instructions, subject } =
      strings.email.request_approved;

    await sendMail({
      buttonLink: `/auth/${user.emailHash}/${user.loginToken}?go=/request/${group.recordID}`,
      buttonText,
      currentAccountID: user.currentAccountID,
      headline: formatString(headline, {
        group: group.name,
      }),
      instructions,
      request,
      subject,
      to: user.email,
    });
  }

  return json({ group, user });
};

export default function Approve() {
  const { group, user } = useLoaderData();
  return (
    <Message
      heading={strings.request.approved}
      text={formatString(strings.request.approved_description, {
        group: group.name,
        user: user.name,
      })}
    />
  );
}
