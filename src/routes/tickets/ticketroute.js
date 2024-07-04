import express  from 'express';
import multer from '../../config/multer.js';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} from '../../controllers/ticketController.js';
const router = express.Router();

router.post('/create', multer.array('eventCoverPhotos', 5), createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;
