import express from "express";
import {
  buyTicket,
  handleCallback,
  freeTicket
} from "../../controllers/buyTicketcontroller.js";

const router = express.Router();

router.post("/buyticket/:id", buyTicket);
router.post("/freeticket/:id", freeTicket)
router.get("/verify-payment/event/:eventId/ticket/:ticketId/callback", handleCallback);

export default router;
