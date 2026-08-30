import prisma from "../db/prisma.js";
import {
  changeCurrentPasswordService,
  createUserService,
  deleteService,
  getUserByIdService,
  getUserChannelProfileService,
  getUserService,
  getWatchHistoryService,
  updateAccountDetailsService,
  updateAvatarService,
  updateCoverImageService,
  updateService,
} from "../services/user.service.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

export const userController = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, avatar, role } = req.body;

  const user = await createUserService({
    username,
    fullName,
    email,
    password,
    avatar,
    role,
  });
  return res
    .status(201)
    .json(new apiResponse(201, user, "User created successfully"));
});

export const getController = asyncHandler(async (req, res) => {
  const user = await getUserService();
  return res.status(200).json({
    success: true,
    message: `All User Data`,
    data: user,
  });
});

export const getByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await getUserByIdService({ id });
  return res.status(200).json({
    success: true,
    message: `User Updated Successfully`,
    data: user,
  });
});

export const updateController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, fullName, role } = req.body;
  const user = await updateService({ username, fullName, role, id });
  return res.status(200).json({
    success: true,
    message: `User updated Successfully.`,
    data: user,
  });
});

export const deleteController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await deleteService({ id });
  return res.status(204).json({
    success: true,
    message: `User Deleted Successfully`,
    data: user,
  });
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  await changeCurrentPasswordService({ oldPassword, newPassword, userId });
  return res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

export const avatar = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file not found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "error while uploading the avatar");
  }
  const user = await updateAvatarService({ userId, avatarUrl: avatar.url });

  return res.status(200).json({
    success: true,
    message: "update avatar",
    user,
  });
});


export const getCurrentUser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(200, req.user, "current user fetched successfully.")
  
})

export const updateAccountDetails = asyncHandler(async(req,res)=>{
  /* todo
  1)take field to update like email, password
  2)validate it
  3)save it to database */
  const userId= req.user.id
  const {username, email} = req.body
  if(!username || !email){
    throw new ApiError(404, "username and email are required.")
  }
  await updateAccountDetailsService({userId,username, email})
  return res
  .status(200)
  .json({
    success: true,
    message: "User Account updated successfully"
  })
})

// this is updateUserCoverImage
export const coverImage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(400, "user id not found");
  }
  const coverImageLocalPath = req.file?.path;
  console.log(coverImageLocalPath);
  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage not found");
  }

  const uploadCoverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!uploadCoverImage.url) {
    throw new ApiError(400, "error while uploadCoverImage");
  }

  const localCoverImage = await updateCoverImageService({
    userId,
    coverImageUrl: uploadCoverImage.url,
  });

  return res.status(200).json({
    success: true,
    message: "coverImage updated",
    localCoverImage,
  });
});

export const getUserChannelProfile = asyncHandler(async(req,res)=>{
  const {username}= req.params
  if(!username){
    throw new ApiError(400, "username is missing")
  }
  const channel = await getUserChannelProfileService({username, userId: req.user.id})
  return res
  .status(200)
  .json({
    success: true,
    message: "Channel profile fetched successfully.",
    data: channel
  })
})

export const getWatchHistory = asyncHandler(async(req,res)=>{
  const userId = req.user.id
  const watchHistory= await getWatchHistoryService({userId})
  return res.status(200).json({
    success: true,
    message: "watch history fetched successfully",
    data: watchHistory
  })
})