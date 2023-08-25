import { validationError } from "remix-validated-form";
import md5 from "blueimp-md5";
import { json } from "@remix-run/node";
import type { Prisma } from "@prisma/client";

import { config, formatValidator } from "~/helpers";
import { db } from "../utils/db.server";
import { strings } from "~/i18n";

export async function addGroupRep(
  formData: FormData,
  groupID: string,
  userID: string
) {
  const validator = formatValidator("group-rep-add");
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
      type: "add", // todo change this to "addUser" - also change the activity type in the db
      userID,
      targetID: user.id,
    },
  });

  return json({
    success: strings.group.userAdded,
  });
}

export async function editGroupRep(
  formData: FormData,
  groupID: string,
  userID: string
) {
  const validator = formatValidator("group-rep-edit");
  const { data, error } = await validator.validate(formData);
  if (error) {
    return validationError(error);
  }
  const { id, name, email } = data;

  // user we're editing must exist
  const user = await db.user.findUniqueOrThrow({ where: { id } });

  // if changing email, make sure it doesn't already exist
  if (user.email !== email) {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      // swap users
      await db.group.update({
        where: { id: groupID },
        data: {
          users: {
            disconnect: { id },
            connect: { id: existingUser.id },
          },
        },
      });
      // update name if it's different
      if (existingUser.name !== name) {
        await db.user.update({
          where: { id: existingUser.id },
          data: {
            name,
          },
        });
      }
    }
  } else {
    await db.user.update({
      where: { id },
      data: {
        name,
        email,
        emailHash: md5(email),
      },
    });
    // todo notify user
  }

  await db.activity.create({
    data: {
      groupID: groupID,
      type: "editUser",
      userID,
      targetID: id,
    },
  });

  return json({
    success: strings.group.userEdited,
  });
}

export async function countGroups(where?: Prisma.GroupWhereInput) {
  return await db.group.count({
    where,
  });
}

export async function getGroups(skip?: number, where?: Prisma.GroupWhereInput) {
  return await db.group.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      createdAt: true,
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
      activity: {
        select: {
          user: {
            select: {
              name: true,
              emailHash: true,
            },
          },
        },
        where: {
          type: "create",
        },
        take: 1,
      },
    },
    skip,
    take: config.batchSize,
    where,
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
