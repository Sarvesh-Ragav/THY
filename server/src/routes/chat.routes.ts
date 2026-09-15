import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/authenticate.js';
import {
  ensureThread,
  listThreads,
  listMessages,
  uploadChatMedia,
  serveChatMedia,
  listCustomerDesigns,
  listCustomerMeasurements,
} from '../controllers/chat.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
});

export const chatRouter = Router();

// Public media serving for HTML tags <img /> and <audio />
chatRouter.get('/media/:id', serveChatMedia);

// Authenticated endpoints
chatRouter.post('/threads', authenticate, ensureThread);
chatRouter.get('/threads', authenticate, listThreads);
chatRouter.get('/threads/:threadId/messages', authenticate, listMessages);
chatRouter.post('/upload', authenticate, upload.single('file'), uploadChatMedia);
chatRouter.get('/designs', authenticate, listCustomerDesigns);
chatRouter.get('/measurements', authenticate, listCustomerMeasurements);
