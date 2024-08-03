import express from "express";
import {
  updateUser,
  getTicketsSold,
  getEventsMade
} from "../../controllers/userController.js";
import multer from "../../config/multer.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.put("/updateuser/:id", multer.array("profilePhoto", 5), protectRoute,updateUser);
router.get("/ticketsold/:id", protectRoute,getTicketsSold);
router.get("/eventscreated/:id", protectRoute, getEventsMade);

export default router;
