import { Router } from "express";
import {
  avatar,
  coverImage,
  deleteController,
  getByIdController,
  getController,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
  updateController,
  userController,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();
router.post("/createUser", userController);
router.get("/getUser", getController);
router.get("/getUserById/:id", getByIdController);
router.put("/updateUser/:id", updateController);
router.delete("/deleteUser/:id", deleteController);
router.patch("/avatar", verifyJWT, upload.single("avatar"), avatar);
router.patch("/coverImage", verifyJWT, upload.single("coverImage"), coverImage);
router.post("/updateAccount",verifyJWT, updateAccountDetails)
router.get("/getUserChannelProfile", verifyJWT, getUserChannelProfile)
router.get("/watch-history", verifyJWT, getWatchHistory)
export default router;
