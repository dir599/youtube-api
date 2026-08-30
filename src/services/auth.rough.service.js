import { use } from "react";
import prisma from "../db/prisma";
import { comparePassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken } from "../token";
const safeData = {
  id: true,
  email: true,
  role: true,
};

export const loginService = async ({ email, password }) => {
  /*
    todo:
    1)Find there exist email or not
    2)validate email or password 
    3)compare password
    4)generate accessToken and refreshToken
    5)update the user */

  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: safeData,
  });
  if (!findUser) {
    throw new Error("User doesn't exist");
  }

  const passwordCompare = await comparePassword(password, findUser.password);
  if (passwordCompare !== findUser.password) {
    throw new Error("invalid email or password");
  }

  const newAccessToken = generateAccessToken(findUser);
  const newRefreshToken = generateRefreshToken(findUser);

  const user = await prisma.user.update({
    where: {
      id: findUser.id,
    },
    data: {
      newRefreshToken,
    },
  });
  return {
    findUser: {
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
      fullName: findUser.fullName,
      avatar: findUser.avatar,
      coverImage: findUser.coverImage,
      role: findUser.role,
    },
    newAccessToken,
    newRefreshToken,
  };
};
