import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { readAllNotifications, readNotifications, readOneNotification } from '../controllers/notification.controller.js';

export const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get('/', readNotifications);
notificationRouter.patch('/read-all', readAllNotifications);
notificationRouter.patch('/:id/read', readOneNotification);
