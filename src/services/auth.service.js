import prisma from "../db/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../token.js";
import { ApiError } from "../utils/apiError.js";
import { comparePassword, hashedPassword } from "../utils/password.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import jwt from "jsonwebtoken"

// import bcrypt from "bcrypt";

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
    error.statusCode = 401;
    throw error;
  }

  //   3) Generate access token
  const accessToken = generateAccessToken(findUser);

  // 4) Generate refresh token
  const refreshToken = generateRefreshToken(findUser);

  // 5) Save refresh token
  await prisma.user.update({
    where: {
      id: findUser.id,
    },
    data: {
      refreshToken,
    },
  });

  //  Return safe user data
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
    accessToken,
    refreshToken,
  };
};

export const registerService = async ({
  id,
  email,
  password,
  username,
  fullName,
  avatarLocalPath,
  coverImageLocalPath,
  role,
}) => {
  if (
    !email?.trim() ||
    !password?.trim() ||
    !username?.trim() ||
    !fullName?.trim()
  ) {
    throw new ApiError(400, "All required fields are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username,
          email,
        },
      ],
    },
  });
  if (existingUser) {
    throw new ApiError(409, "Username or Email already exists.");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // // console
  // console.log(avatarLocalPath);
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar file is required.");
  // }

  // to upload in cloudinary
  const avatars = await uploadOnCloudinary(avatarLocalPath);
  const coverImages = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatars) {
    throw new Error(409, "avatar uploaded failed.");
  }

  const hashed_Password = await hashedPassword(password);

  // crate user
  const user = await prisma.user.create({
    data: {
      id,
      username,
      email,
      password: hashed_Password,
      fullName,
      avatar: avatars.url,
      coverImage: coverImages?.url || "",
      role,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      avatar: true,
      coverImage: true,
      role: true,
    },
  });

  return user;
};

export const logOutService = async ({ userId }) => {
  console.log(userId);
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  });
};

// refresh token
export const generateRefreshAndAccessTokenService = async ({ refreshToken }) => {
  // todo
  // 1. Check whether refresh token was provided
  // 2. Verify the refresh token
  // 3. Find the user from the token
  // 4). Check whether user exists
  // 5) Check whether refresh token matches the one stored in DB
  // 6) generate new refresh token
  // 7) return the new refresh token
  if (!refreshToken) {
    throw new Error(401, "refresh token doesn't exit");
  }
  
  let decodedToken;
  try {
    decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      refreshToken: true,
    },
  });

  if (!user) {
    throw new ApiError(401, "user not found");
  }
  // check the stored refreshToken matches the one stored in db
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Refresh token invalid");
  }


  const accessToken = generateAccessToken(user)
  // Generate a new access token
  const newRefreshToken = generateAccessToken(user);

   await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: newRefreshToken,
    },
  });


  return {
    accessToken,
    newRefreshToken
  } ;
};
