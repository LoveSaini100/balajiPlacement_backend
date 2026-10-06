import express from 'express';
import {
  getConversations,
  getMessagesByConversation,
  sendMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/conversations/:id/messages', protect, getMessagesByConversation);
router.post('/conversations/:id/send', protect, sendMessage);

export default router;
