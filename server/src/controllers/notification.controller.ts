import type { RequestHandler } from 'express';
import { listUserNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notification.service.js';

export const readNotifications: RequestHandler = async (request, response, next) => {
  try {
    const notifications = await listUserNotifications(request.auth!.userId);
    response.json({ success: true, data: { notifications } });
  } catch (error) {
    next(error);
  }
};

export const readOneNotification: RequestHandler = async (request, response, next) => {
  try {
    const notification = await markNotificationRead(request.auth!.userId, String(request.params.id || ''));
    response.json({ success: true, data: { notification } });
  } catch (error) {
    next(error);
  }
};

export const readAllNotifications: RequestHandler = async (request, response, next) => {
  try {
    const updated = await markAllNotificationsRead(request.auth!.userId);
    response.json({ success: true, data: { updated } });
  } catch (error) {
    next(error);
  }
};
