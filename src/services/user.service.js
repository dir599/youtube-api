import prisma from "../db/prisma.js";
import { hashedPassword } from "../utils/password.js";
import { ApiError } from "../utils/apiError.js";
import bcrypt from "bcrypt";
import { avatar } from "../controllers/user.controller.js";

const dataSafe = {
  username: true,
  fullName: true,
  email: true,
  avatar: true,
  role: true,
};

export const createUserService = async ({
  username,
  email,
  fullName,
  password,
  avatar,
  role,
}) => {
  if (!username || !email || !fullName || !password) {
    const error = new Error(
      "All these are required like username, email, fullName, password"
    );
    error.status = 400;
    throw error;
  }
  const hashedPass = await hashedPassword(password);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        fullName,
        email,
        password: hashedPass,
        avatar,
        role,
      },
      select: {
        username: true,
        fullName: true,
        email: true,

        role: true,
      },
    });
    return user;
  } catch (error) {
    if (error.code === "P2002") {
      throw new ApiError(409, "Username or email already exists");
    }

    throw error;
  }
};

export const getUserService = async () => {
  const user = await prisma.user.findMany({
    select: dataSafe,
  });
  return user;
};

export const getUserByIdService = async ({ id }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    select: dataSafe,
  });
  return user;
};

export const updateService = async ({ id, username, fullName, role }) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        username,
        fullName,
        role,
      },
      select: dataSafe,
    });
    return user;
  } catch (error) {
    const err = new Error("username and email already exists");
    err.status = 403;
    throw err;
  }
};

export const deleteService = async ({ id }) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
      select: dataSafe,
    });
  } catch (error) {
    const err = new Error("Id not found");
    err.status = 404;
    throw err;
  }
};

export const changeCurrentPasswordService = async ({
  userId,
  oldPassword,
  newPassword,
}) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "current password is incorrect");
  }

  const hashed_Password = await hashedPassword(newPassword);
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashed_Password,
    },
  });
  return updateUser;
};

export const updateAvatarService = async ({ userId, avatarUrl }) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatar: avatarUrl,
    },
    select: dataSafe,
  });
  if (!user) {
    throw new Error(404, "user not found");
  }
  return user;
};

export const updateCoverImageService = async ({ userId, coverImageUrl }) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      coverImage: coverImageUrl,
    },
    select: dataSafe,
  });
  if (!user) {
    throw new Error(404, "user not found");
  }
  return user;
};

export const updateAccountDetailsService = async ({
  userId,
  username,
  email,
}) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
      email,
    },
    select: dataSafe,
  });
  return user;
};

export const getUserChannelProfileService = async ({ username, userId }) => {
  const channelUser = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      dataSafe,
      _count: {
        select: {
          subscribers: true,
          subscriptions: true,
        },
      },
    },
  });
  if(!channelUser){
    throw new ApiError(404, "Channel not found")
  }
  const subscription = await prisma.subscriptions.findFirst({
    where: {
      subscriberId: userId,
      channelId: channelUser.id
    }
  })
  return {...channelUser, isSubscribed: !! subscription}
};

export const getWatchHistoryService = async({userId})=>{ 
  const watchHistory = await prisma.watchHistory.findMany({
    where: {
       userId
    },orderBy: {
      watchedAt: "desc"
    },select: {
      id: true,
      watchedAt: true,
      video: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          duration: true,
          views: true,
          owner: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatar: true,
            }
          }
        }
      }
    }
  })
  return watchHistory
}
