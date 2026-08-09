import {  Router } from "express";
import { login } from "../controllers/auth.controller.js";


const router = new Router()
router.post("/loginUser", login)

export default router