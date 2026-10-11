import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.js";
import { getUser, login, logout, register } from "../controllers/user.controllers.js";
const router=Router();

router.post("/register",register)
router.post("/login",login)
router.get("/",verifyJwt,getUser)
router.get("/logout",verifyJwt,logout)