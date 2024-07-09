import express  from 'express';
// import protectRoute from '../../middlewares/protectRoute.js'
import multer from '../../config/multer.js';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../../controllers/eventController.js';
const router = express.Router();

router.post('/create', multer.array('eventCoverPhotos', 5), createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
