import express from "express";
// import { sendTicketMail} from '../../controllers/ticketPurchasecontroller.js';
import {
  buyTicket,
  handleCallback,
} from "../../controllers/buyTicketcontroller.js";
// import {createSubaccount, buyTicket,handleCallback,} from '../../'

const router = express.Router();

// router.post("/Subaccount",createSubaccount)
router.post("/buyticket/:id", buyTicket);
router.get("/verify", handleCallback);

export default router;
