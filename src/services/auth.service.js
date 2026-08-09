import prisma from "../db/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../token.js";
import { comparePassword } from "../utils/password.js";

export const loginUser = async ({ email, password }) => {
  // 1) find user
  const findUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!findUser) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  //   2) password incorrect
  const isPasswordValid = await comparePassword(password, findUser.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.Status = 401;
    throw error;
  }

  //   3) Generate access token
  const accessToken = generateAccessToken(user);

  // 4) Generate refresh token
  const refreshToken = generateRefreshToken(user);

  // 5) Save refresh token
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
    },
  });

  //  Return safe user data
  return {
    findUser: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      coverImage: user.coverImage,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};
