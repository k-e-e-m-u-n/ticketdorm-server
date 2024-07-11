import express from "express";
import {
  signUp,
  verifyOtp,
  signIn,
  resetPasswordMail,
  resetPassword,
} from "../../controllers/authController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/verifyOtp", verifyOtp);
router.post("/reset", resetPasswordMail);
router.put("/resetPassword/:id", resetPassword);

export default router;
