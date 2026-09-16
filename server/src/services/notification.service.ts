import { Types } from 'mongoose';
import { UserNotification } from '../models/Notification.js';
import { TailorProfile } from '../models/TailorProfile.js';

export type InboxAudience = 'customer' | 'tailor';

export type InboxItem = {
  id: string;
  audience: InboxAudience;
  type: string;
  title: string;
  description: string;
  linkUrl: string;
  threadId?: string;
  timestamp: string;
  isRead: boolean;
};

function formatTimestamp(value?: Date | null): string {
  const date = value || new Date();
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mapNotification(doc: {
  _id: { toString(): string };
  audience: InboxAudience;
  type?: string;
  title: string;
  description?: string | null;
  linkUrl?: string | null;
  threadId?: string | null;
  createdAt?: Date;
  isRead?: boolean;
}): InboxItem {
  return {
    id: doc._id.toString(),
    audience: doc.audience,
    type: doc.type || 'chat',
    title: doc.title,
    description: doc.description || '',
    linkUrl: doc.linkUrl || '',
    threadId: doc.threadId || undefined,
    timestamp: formatTimestamp(doc.createdAt),
    isRead: Boolean(doc.isRead),
  };
}

async function tailorChatRef(tailorUserId: Types.ObjectId | string): Promise<string> {
  const profile = await TailorProfile.findOne({ userId: tailorUserId }).select('publicId userId');
  return profile?.publicId || profile?.userId?.toString() || String(tailorUserId);
}

export async function createChatNotification(input: {
  thread: {
    _id: { toString(): string };
    customerId: { toString(): string };
    tailorId: { toString(): string };
    customerName?: string;
    tailorName?: string;
    tailorStudio?: string;
  };
  messageId: string;
  sender: 'customer' | 'tailor';
  kind: string;
  preview: string;
}): Promise<InboxItem | null> {
  const recipientRole: InboxAudience = input.sender === 'customer' ? 'tailor' : 'customer';
  const recipientUserId = input.sender === 'customer' ? input.thread.tailorId : input.thread.customerId;
  const threadId = input.thread._id.toString();
  const tailorRef = await tailorChatRef(input.thread.tailorId);
  const counterpart =
    recipientRole === 'customer'
      ? input.thread.tailorName || input.thread.tailorStudio || 'Your tailor'
      : input.thread.customerName || 'Customer';
  const isQuote = input.kind === 'quotation';
  const title = isQuote
    ? 'New quotation'
    : recipientRole === 'customer'
      ? `Message from ${counterpart}`
      : `Chat from ${counterpart}`;
  const linkUrl =
    recipientRole === 'customer'
      ? `/chat?tailor=${encodeURIComponent(tailorRef)}&thread=${encodeURIComponent(threadId)}`
      : `/tailor-dashboard/chat?thread=${encodeURIComponent(threadId)}`;

  const doc = await UserNotification.findOneAndUpdate(
    { userId: recipientUserId, eventKey: `chat-${input.messageId}` },
    {
      $setOnInsert: {
        userId: recipientUserId,
        audience: recipientRole,
        eventKey: `chat-${input.messageId}`,
        type: isQuote ? 'quotation' : 'chat',
        title,
        description: (input.preview || 'New message').slice(0, 160),
        linkUrl,
        threadId,
        isRead: false,
      },
    },
    { upsert: true, returnDocument: 'after' }
  );

  return doc ? mapNotification(doc) : null;
}

export async function listUserNotifications(userId: string): Promise<InboxItem[]> {
  const rows = await UserNotification.find({ userId }).sort({ createdAt: -1 }).limit(40);
  return rows.map(mapNotification);
}

export async function markNotificationRead(userId: string, id: string): Promise<InboxItem | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  const doc = await UserNotification.findOneAndUpdate(
    { _id: id, userId },
    { $set: { isRead: true } },
    { returnDocument: 'after' }
  );
  return doc ? mapNotification(doc) : null;
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const result = await UserNotification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
  return result.modifiedCount || 0;
}
