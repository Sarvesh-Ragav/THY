import { Types } from 'mongoose';
import { User } from '../models/User.js';
import { TailorProfile } from '../models/TailorProfile.js';
import { CustomerProfile } from '../models/CustomerProfile.js';
import { Order } from '../models/Order.js';
import { ApiError } from '../utils/api-error.js';

const FULFILLMENT = ['pending', 'in_progress', 'completed', 'cancelled'] as const;
export type FulfillmentStatus = (typeof FULFILLMENT)[number];

function oid(id: string) {
  if (!Types.ObjectId.isValid(id)) throw new ApiError(400, 'Invalid id.', 'INVALID_ID');
  return new Types.ObjectId(id);
}

export async function listAdminTailors() {
  const profiles = await TailorProfile.find().sort({ updatedAt: -1 }).lean();
  const userIds = profiles.map((p) => p.userId);
  const users = await User.find({ _id: { $in: userIds } }).select('email phoneNumber isActive role name').lean();
  const byId = new Map(users.map((u) => [u._id.toString(), u]));

  return profiles.map((profile) => {
    const user = byId.get(profile.userId.toString());
    const documents = profile.verification?.documents || [];
    return {
      id: profile.userId.toString(),
      profileId: profile._id.toString(),
      fullName: profile.fullName,
      shopName: profile.shopName,
      city: profile.city,
      email: user?.email || null,
      phone: user?.phoneNumber || null,
      isActive: user?.isActive !== false,
      isDirectoryActive: profile.isDirectoryActive !== false,
      verificationStatus: profile.verification?.status || (documents.length || profile.verification?.documentName ? 'pending' : 'not_submitted'),
      verificationDocument: profile.verification?.documentName || null,
      verificationIdType: profile.verification?.idType || null,
      reviewNotes: profile.verification?.reviewNotes || '',
      documentCount: documents.length,
      documents: documents.map((doc) => ({
        kind: doc.kind,
        fileName: doc.fileName,
        mimeType: doc.mimeType,
      })),
      submittedAt: profile.verification?.submittedAt || null,
      reviewedAt: profile.verification?.reviewedAt || null,
      yearsOfExperience: profile.yearsOfExperience,
      createdAt: profile.createdAt,
    };
  });
}

export async function getTailorVerificationDocuments(userId: string) {
  const profile = await TailorProfile.findOne({ userId: oid(userId) }).lean();
  if (!profile) throw new ApiError(404, 'Tailor profile was not found.', 'TAILOR_NOT_FOUND');
  const verification = profile.verification;
  return {
    id: userId,
    shopName: profile.shopName,
    fullName: profile.fullName,
    verificationStatus: verification?.status || 'pending',
    idType: verification?.idType || null,
    documentName: verification?.documentName || null,
    reviewNotes: verification?.reviewNotes || '',
    submittedAt: verification?.submittedAt || null,
    reviewedAt: verification?.reviewedAt || null,
    documents: (verification?.documents || []).map((doc) => ({
      kind: doc.kind,
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      dataUrl: doc.dataUrl,
    })),
  };
}

export async function setTailorVerification(
  userId: string,
  status: 'approved' | 'rejected' | 'pending',
  reviewNotes = ''
) {
  const profile = await TailorProfile.findOne({ userId: oid(userId) });
  if (!profile) throw new ApiError(404, 'Tailor profile was not found.', 'TAILOR_NOT_FOUND');

  const hasDocs = Boolean(
    profile.verification?.documentName ||
      profile.verification?.idNumberHash ||
      (profile.verification?.documents && profile.verification.documents.length > 0)
  );
  if (!hasDocs && status !== 'pending') {
    throw new ApiError(400, 'This tailor has not submitted verification documents yet.', 'NO_DOCUMENTS');
  }

  profile.set('verification.status', status);
  profile.set('verification.reviewedAt', status === 'pending' ? null : new Date());
  profile.set('verification.reviewNotes', reviewNotes.trim());
  await profile.save();
  return {
    id: userId,
    verificationStatus: profile.verification?.status || status,
    reviewNotes: profile.verification?.reviewNotes || '',
    reviewedAt: profile.verification?.reviewedAt || null,
  };
}

export async function setTailorDirectoryActive(userId: string, isDirectoryActive: boolean) {
  const profile = await TailorProfile.findOneAndUpdate(
    { userId: oid(userId) },
    { $set: { isDirectoryActive } },
    { new: true }
  );
  if (!profile) throw new ApiError(404, 'Tailor profile was not found.', 'TAILOR_NOT_FOUND');
  return { id: userId, isDirectoryActive: profile.isDirectoryActive };
}

export async function listAdminCustomers() {
  const profiles = await CustomerProfile.find().sort({ updatedAt: -1 }).lean();
  const userIds = profiles.map((p) => p.userId);
  const users = await User.find({ _id: { $in: userIds } }).select('email phoneNumber isActive name createdAt').lean();
  const byId = new Map(users.map((u) => [u._id.toString(), u]));

  return profiles.map((profile) => {
    const user = byId.get(profile.userId.toString());
    const address = profile.addresses?.find((a) => a.isDefault) ?? profile.addresses?.[0];
    return {
      id: profile.userId.toString(),
      profileId: profile._id.toString(),
      fullName: profile.fullName,
      email: profile.email || user?.email || null,
      phone: user?.phoneNumber || null,
      city: profile.city,
      address: address?.addressLine1 || '',
      isActive: user?.isActive !== false,
      preferences: profile.preferences || null,
      createdAt: profile.createdAt || user?.createdAt || null,
    };
  });
}

export async function setUserActive(userId: string, isActive: boolean) {
  const user = await User.findByIdAndUpdate(oid(userId), { $set: { isActive } }, { new: true }).select(
    'email role isActive name'
  );
  if (!user) throw new ApiError(404, 'User was not found.', 'USER_NOT_FOUND');
  if (user.role === 'admin') throw new ApiError(400, 'Admin accounts cannot be deactivated here.', 'ADMIN_PROTECTED');
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    name: user.name,
  };
}

export async function listAdminOrders() {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200).lean();
  return orders.map((order) => ({
    id: order._id.toString(),
    userId: order.userId?.toString() || null,
    tailorId: order.tailorId?.toString() || null,
    tailorName: order.tailorName,
    garmentName: order.garmentName,
    amountPaise: order.amountPaise,
    currency: order.currency,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    deliveryAddress: order.deliveryAddress,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
}

export async function updateOrderFulfillment(orderId: string, fulfillmentStatus: FulfillmentStatus) {
  if (!FULFILLMENT.includes(fulfillmentStatus)) {
    throw new ApiError(400, 'Invalid fulfillment status.', 'INVALID_STATUS');
  }
  const order = await Order.findByIdAndUpdate(
    oid(orderId),
    { $set: { fulfillmentStatus } },
    { new: true }
  );
  if (!order) throw new ApiError(404, 'Order was not found.', 'ORDER_NOT_FOUND');
  return {
    id: order._id.toString(),
    garmentName: order.garmentName,
    tailorName: order.tailorName,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
  };
}

export async function getAdminOverview() {
  const [tailors, customers, orders, pendingVerifications] = await Promise.all([
    TailorProfile.countDocuments(),
    CustomerProfile.countDocuments(),
    Order.countDocuments(),
    TailorProfile.countDocuments({ 'verification.status': 'pending' }),
  ]);
  return { tailors, customers, orders, pendingVerifications };
}
