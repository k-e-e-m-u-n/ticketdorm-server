import express  from 'express';
import { createContact } from '../../controllers/contactUsController.js';

const router = express.Router();

router.post('/contactUs',createContact)

export default router;