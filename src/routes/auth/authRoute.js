import express from "express";
import { signUp,verifyOtp,signIn } from "../../controllers/authController.js";

const router = express.Router()

router.post("/register",signUp)
router.post("/login", signIn)
router.post("/verifyOtp",verifyOtp)

export default router;
