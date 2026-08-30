import {  Router } from "express";
import { login, logoutUser, refreshAccessToken, registerUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = new Router()
router.post("/loginUser", login)
router.post("/registerUser",upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]) , registerUser)

// secured routes
router.post("/logout",verifyJWT, logoutUser)
router.post("/refreshToken", refreshAccessToken)

export default router