import express from "express";
import {
  buyTicket,
  handleCallback,
} from "../../controllers/buyTicketcontroller.js";

const router = express.Router();

router.post("/buyticket/:id", buyTicket);
router.get("/verify-payment/event/:eventId/ticket/:ticketId/callback", handleCallback);

export default router;
