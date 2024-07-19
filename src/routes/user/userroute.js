import express from 'express';
import { updateUser } from '../../controllers/userController.js';
import multer from "../../config/multer.js";

const router = express.Router();

router.put("/updateuser/:id", multer.array("profilePhoto", 5), updateUser);

export default router;