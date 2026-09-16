import type { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { ChatThread, ChatMessage } from '../models/Chat.js';
import { ChatMedia } from '../models/ChatMedia.js';
import { TailorProfile } from '../models/TailorProfile.js';
import { CustomerProfile } from '../models/CustomerProfile.js';
import { CustomerMeasurement } from '../models/CustomerMeasurement.js';
import { StudioDesign } from '../models/StudioDesign.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';

export const ensureThread: RequestHandler = async (req, res, next) => {
  try {
    const customerId = req.auth?.userId;
    if (!customerId) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const { tailorId } = req.body;
    if (!tailorId) {
      throw new ApiError(400, 'tailorId is required', 'VALIDATION_ERROR');
    }

    // Lookup tailor profile by publicId, _id, or userId
    const isObjectId = Types.ObjectId.isValid(tailorId);
    let tailorProfile = await TailorProfile.findOne({
      $or: [
        { publicId: tailorId },
        ...(isObjectId ? [{ _id: tailorId }, { userId: tailorId }] : []),
      ],
    });

    let tailorUserId: Types.ObjectId;
    let tailorName = 'Tailor';
    let tailorStudio = '';

    if (tailorProfile) {
      tailorUserId = tailorProfile.userId;
      tailorName = tailorProfile.fullName || tailorProfile.shopName || 'Tailor';
      tailorStudio = tailorProfile.shopName || '';
    } else if (isObjectId) {
      const tailorUser = await User.findById(tailorId);
      if (tailorUser) {
        tailorUserId = tailorUser._id as Types.ObjectId;
        tailorName = tailorUser.name || 'Tailor';
      } else {
        throw new ApiError(404, 'Tailor not found', 'NOT_FOUND');
      }
    } else {
      // If mock tailor ID like 't-ananya' or similar not yet in DB, find any tailor user or create reference
      const anyTailor = await TailorProfile.findOne();
      if (anyTailor) {
        tailorUserId = anyTailor.userId;
        tailorName = anyTailor.fullName || 'Tailor';
        tailorStudio = anyTailor.shopName || '';
      } else {
        throw new ApiError(404, 'Tailor not found', 'NOT_FOUND');
      }
    }

    const threadKey = `${customerId}_${tailorUserId.toString()}`;

    const customerUser = await User.findById(customerId);
    const customerProfile = await CustomerProfile.findOne({ userId: customerId });
    const customerName = customerProfile?.fullName || customerUser?.name || 'Customer';
    const defaultSystemText = `You can talk through design, fabric, measurements, customization, and price with ${tailorName}.`;

    let thread = await ChatThread.findOne({
      $or: [
        { threadKey },
        { customerId: new Types.ObjectId(customerId), tailorId: tailorUserId },
      ],
    });

    if (!thread) {
      try {
        thread = await ChatThread.findOneAndUpdate(
          { threadKey },
          {
            $setOnInsert: {
              threadKey,
              customerId: new Types.ObjectId(customerId),
              tailorId: tailorUserId,
              customerName,
              tailorName,
              tailorStudio,
              status: 'new',
              unreadCountCustomer: 0,
              unreadCountTailor: 0,
              lastMessage: {
                text: defaultSystemText,
                sender: 'system',
                kind: 'system',
                sentAt: new Date(),
              },
            },
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
      } catch (err: any) {
        if (err.code === 11000) {
          thread = await ChatThread.findOne({
            $or: [
              { threadKey },
              { customerId: new Types.ObjectId(customerId), tailorId: tailorUserId },
            ],
          });
        } else {
          throw err;
        }
      }

      if (thread) {
        const msgExists = await ChatMessage.exists({ threadId: thread._id });
        if (!msgExists) {
          try {
            await ChatMessage.create({
              threadId: thread._id,
              sender: 'system',
              kind: 'system',
              text: defaultSystemText,
              status: 'delivered',
            });
          } catch (mErr) {
            // Ignore race condition on system message creation
          }
        }
      }
    }

    res.status(200).json({ success: true, data: { thread } });
  } catch (err) {
    next(err);
  }
};

export const listThreads: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const threads = await ChatThread.find({
      $or: [
        { customerId: userId },
        { tailorId: userId },
      ],
    }).sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: { threads } });
  } catch (err) {
    next(err);
  }
};

export const listMessages: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    const threadId = req.params.threadId as string;

    if (!threadId || !Types.ObjectId.isValid(threadId)) {
      throw new ApiError(400, 'Invalid thread ID', 'VALIDATION_ERROR');
    }

    const thread = await ChatThread.findById(threadId);
    if (!thread) {
      throw new ApiError(404, 'Thread not found', 'NOT_FOUND');
    }

    if (thread.customerId.toString() !== userId && thread.tailorId.toString() !== userId) {
      throw new ApiError(403, 'Forbidden', 'FORBIDDEN');
    }

    const before = req.query.before ? new Date(req.query.before as string) : undefined;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 50, 100);

    const query: any = { threadId: thread._id };
    if (before && !isNaN(before.getTime())) {
      query.createdAt = { $lt: before };
    }

    const messages = await ChatMessage.find(query).sort({ createdAt: 1 }).limit(limit);

    res.status(200).json({ success: true, data: { messages } });
  } catch (err) {
    next(err);
  }
};

export const uploadChatMedia: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const file = req.file;
    if (!file) {
      throw new ApiError(400, 'File is required', 'VALIDATION_ERROR');
    }

    const threadId = req.body.threadId;
    if (!threadId || !Types.ObjectId.isValid(threadId)) {
      throw new ApiError(400, 'Valid threadId is required', 'VALIDATION_ERROR');
    }

    const media = await ChatMedia.create({
      uploadedBy: new Types.ObjectId(userId),
      threadId: new Types.ObjectId(threadId),
      mimeType: file.mimetype,
      filename: file.originalname || 'upload',
      size: file.size,
      data: file.buffer,
    });

    const url = `/api/v1/chat/media/${media._id}`;
    res.status(201).json({
      success: true,
      data: {
        id: media._id,
        url,
        mimeType: media.mimeType,
        filename: media.filename,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const serveChatMedia: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id as string;
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid media ID', 'VALIDATION_ERROR');
    }

    const media = await ChatMedia.findById(id);
    if (!media) {
      throw new ApiError(404, 'Media not found', 'NOT_FOUND');
    }

    res.setHeader('Content-Type', media.mimeType);
    res.setHeader('Content-Length', media.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(media.data);
  } catch (err) {
    next(err);
  }
};

export const listCustomerDesigns: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const designs = await StudioDesign.find({
      userId: new Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { designs } });
  } catch (err) {
    next(err);
  }
};

const MEASUREMENT_CATEGORIES = ['sarees', 'salwars', 'sherwanis', 'lehengas', 'general', 'other'] as const;

function measurementPayload(doc: { toJSON: () => Record<string, unknown> } | Record<string, unknown>) {
  const obj = typeof (doc as { toJSON?: () => Record<string, unknown> }).toJSON === 'function'
    ? (doc as { toJSON: () => Record<string, unknown> }).toJSON()
    : { ...(doc as Record<string, unknown>) };
  const rawValues = obj.values;
  const values =
    rawValues instanceof Map
      ? Object.fromEntries(rawValues)
      : rawValues && typeof rawValues === 'object'
        ? rawValues
        : {};
  return {
    ...obj,
    id: String(obj.id || obj._id || ''),
    values,
  };
}

export const listCustomerMeasurements: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const measurements = await CustomerMeasurement.find({
      userId: new Types.ObjectId(userId),
    }).sort({ isDefault: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: { measurements: measurements.map(measurementPayload) },
    });
  } catch (err) {
    next(err);
  }
};

export const createCustomerMeasurement: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const values = req.body?.values;
    if (!values || typeof values !== 'object' || Array.isArray(values) || Object.keys(values).length === 0) {
      throw new ApiError(400, 'Enter at least one measurement value.', 'VALIDATION_ERROR');
    }

    const category = MEASUREMENT_CATEGORIES.includes(req.body?.category)
      ? req.body.category
      : 'general';
    const measurement = await CustomerMeasurement.create({
      userId,
      label: String(req.body?.label || 'Saved Measurement Set').trim().slice(0, 160) || 'Saved Measurement Set',
      category,
      values,
      unit: req.body?.unit === 'cm' ? 'cm' : 'inch',
      notes: typeof req.body?.notes === 'string' ? req.body.notes.slice(0, 500) : '',
    });

    res.status(201).json({ success: true, data: { measurement: measurementPayload(measurement) } });
  } catch (err) {
    next(err);
  }
};
