import express from "express";
import protectRoute from '../../middlewares/protectRoute.js'
import multer from "../../config/multer.js";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  deleteAllEvent,
} from "../../controllers/eventController.js";
const router = express.Router();

router.post("/create", multer.array("eventCoverPhotos", 5),protectRoute,createEvent);
// router.post("/create", createEvent);
router.get("/all", getEvents);
router.get("/:id", getEventById);
router.put("/update/:id", updateEvent,protectRoute);
router.delete("/delete/:id", deleteEvent, protectRoute);
router.delete("/deleteAll", deleteAllEvent, protectRoute);

export default router;
