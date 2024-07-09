import express from 'express';
import authroute from '../routes/auth/authRoute.js'
import eventroute from '../routes/event/eventroute.js'
import contactusroute from '../routes/contact/contactusroute.js'
import ticketroute from '../routes/tickets/ticketroute.js'

const router = express.Router();

router.use('/auth', authroute)
router.use('/ticket', ticketroute)
router.use('/event', eventroute)
router.use('/contact', contactusroute)

export default router