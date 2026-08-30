import { Router } from "express";
import authRouter from "./auth.routes.js"
import userRouter from "./user.route.js"



const router = new Router()

router.use("/auth", authRouter)
router.use("/user", userRouter)



export default router