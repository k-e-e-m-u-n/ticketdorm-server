import express  from 'express';
import { sendTicketMail} from '../../controllers/ticketPurchasecontroller.js';

const router = express.Router();

router.post('/sendTicket/:id',sendTicketMail)

export default router;