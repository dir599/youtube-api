import prisma from "../db/prisma.js";

const safeData = {
  id: true,
  videoFile: true,
  thumbnail: true,
  description: true,
  views: true,
  duration: true,
  ownerId: true,
};

// create video
export const createVideoService = async ({
  id,
  videoFile,
  thumbnail,
  title,
  duration,
  ownerId,
  views,
}) => {
  if (!videoFile || !thumbnail || !title || !duration || !ownerId || !views) {
    throw new Error("All these field are required for video..");
  }

  const video = await prisma.video.create({
    // where: {
    //   id: Number(id),
    // },
    data: {
      videoFile,
      thumbnail,
      title,
      duration,
      ownerId,
      views,
    },
    select: safeData,
  });
  //   return {
  //     video:{
  //         safeData
  //     }
  //   }
  return video;
};

// get video
export const getVideoService = async () => {
  const video = await prisma.video.findMany({
    select: safeData,
  });
};

// get video by Id
export const getVideoByIdService = async ({ id }) => {
  const video = await prisma.video.findUnique({
    where: {
      id: Number(id),
    },
    select: safeData,
  });
  return video;
};

// update video
export const updateVideoService = async ({
  id,
  videoFile,
  thumbnail,
  description,
  title,
  ownerId,
}) => {
  const video = await prisma.video.update({
    where: {
      id: Number(id),
    },
    data: {
      videoFile,
      thumbnail,
      description,
      title,
      ownerId,
    },
    select: {
      videoFile: true,
      thumbnail: true,
      description: true,
      ownerId: true,
    },
  });
  return video;
};

// delete video
export const deleteVideoService = async ({ id }) => {
  const video = await prisma.video.delete({
    where: {
      id: Number(id),
    },
    select: safeData,
  });
  return video
};
