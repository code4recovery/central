import { validationError } from "remix-validated-form";
import md5 from "blueimp-md5";
import { json } from "@remix-run/node";

import { config, formatValidator } from "~/helpers";
import { db } from "../utils/db.server";
import { strings } from "~/i18n";

export async function addGroupRep(
  formData: FormData,
  groupID: string,
  userID: string,
  currentAccountID: string
) {
  const validator = formatValidator("group");
  const { data, error } = await validator.validate(formData);
  if (error) {
    return validationError(error);
  }
  const { name, email } = data;

  // create user if it doesn't exist
  await db.group.update({
    where: { id: groupID },
    data: {
      users: {
        connectOrCreate: {
          where: { email },
          create: {
            email,
            name,
            emailHash: md5(email),
            currentAccountID,
          },
        },
      },
    },
  });

  // unfortunately we have to do this in two steps
  const user = await db.user.update({
    data: {
      name,
    },
    where: { email },
  });

  await db.activity.create({
    data: {
      groupID: groupID,
      type: "add",
      userID,
      targetID: user.id,
    },
  });

  return json({
    success: strings.group.userAdded,
  });
}

export async function getGroups(accountID: string, skip?: number) {
  return await db.group.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      updatedAt: true,
      meetings: {
        select: {
          id: true,
        },
      },
      users: {
        select: {
          id: true,
          emailHash: true,
          name: true,
        },
      },
    },
    skip,
    take: config.batchSize,
    where: { accountID },
  });
}

export async function removeGroupRep(
  formData: FormData,
  id: string,
  userID: string
) {
  const targetID = formData.get("targetID") as string;
  if (targetID) {
    await db.user.update({
      where: { id: targetID },
      data: {
        groups: { disconnect: { id } },
      },
    });
    await db.activity.create({
      data: {
        groupID: id,
        type: "remove",
        userID,
        targetID,
      },
    });
    return json({
      success: strings.group.userRemoved,
    });
  }
}
