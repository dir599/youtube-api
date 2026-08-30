import {
  createVideoService,
  deleteVideoService,
  getVideoByIdService,
  getVideoService,
  updateVideoService,
} from "../services/video.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { videoFile, thumbnail, title, description, views, duration, ownerId } =
    req.body;
  const video = await createVideoService({
    id,
    videoFile,
    thumbnail,
    description,
    views,
    duration,
    title,
    ownerId,
  });
  return res.status(201).json({
    success: true,
    message: `Video created successfully.`,
    data: video,
  });
});

export const getController = asyncHandler(async (req, res) => {
  const video = await getVideoService();
  return res.status(200).json({
    success: true,
    message: `Get all video`,
    data: video,
  });
});

export const getByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await getVideoByIdService({ id });
  return res.status(200).json({
    success: true,
    message: `Get video by id`,
    data: video,
  });
});

export const updateController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { videoFile, thumbnail, title,description, ownerId, } = req.body;
  const video = await updateVideoService({
    id,
    videoFile,
    thumbnail,
    description,
    title,
    ownerId,
  });
  return res.status(200).json({
    success: true,
    message: `updated video`,
    data: video,
  });
});

export const deleteController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await deleteVideoService({ id });
  return res.status(204).json({
    success: true,
    message: `video deleted by id`,
    data: video,
  });
});
