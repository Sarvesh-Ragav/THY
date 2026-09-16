import {
  type CustomerOrderSave,
  type CustomerOrderTimeline,
  type StudioNotification,
  type StudioNotificationType,
  type TailorActiveOrder,
  type TailorOrderRequest,
  type TailorSession,
} from '@/lib/tailor-session';
import { ORDER_STAGES, addStudioNotification, orderStatusFromStage } from '@/lib/tailor-studio';
import type { ChatMessage } from '@/lib/chat-api';

const CUSTOMER_STEPS = [
  'Order confirmed',
  'Fabric picked up',
  'Cutting & stitching',
  'Quality check & ironing',
  'Stitched outfit given',
] as const;

export function unreadCount(items?: StudioNotification[] | null): number {
  return (items ?? []).filter((item) => !item.isRead).length;
}

export function markInboxRead(items: StudioNotification[], id?: string): StudioNotification[] {
  return items.map((item) => (id && item.id !== id ? item : { ...item, isRead: true }));
}

function stamp(type: StudioNotificationType, title: string, description: string, linkUrl: string, id?: string): Omit<StudioNotification, 'timestamp' | 'isRead'> {
  return { id: id || `notif-${type}-${Date.now()}`, type, title, description, linkUrl };
}

export function buildOrderTimeline(stage: number, now = new Date()): CustomerOrderTimeline[] {
  const current = Math.min(5, Math.max(1, stage));
  const time = now.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  return CUSTOMER_STEPS.map((title, index) => {
    const step = index + 1;
    return {
      title,
      time: step < current ? time : step === current ? (current >= 5 ? time : 'In progress') : 'Pending',
      completed: step < current || current >= 5,
      active: step === current && current < 5,
    };
  });
}

export function customerOrderFromPlacement(input: {
  id: string;
  title: string;
  tailorName: string;
  location?: string;
  total: number;
  paymentMode: string;
  deliveryAddress: string;
  fabric?: string;
  pickupSlot?: string;
}): CustomerOrderSave {
  return {
    ...input,
    status: 'In Progress',
    date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    currentStage: 1,
    currentStageText: CUSTOMER_STEPS[0],
    timeline: buildOrderTimeline(1),
  };
}

export function syncCustomerOrder(order: TailorActiveOrder, existing?: CustomerOrderSave): CustomerOrderSave {
  const stage = order.currentStage || 1;
  return {
    id: order.id,
    title: order.garmentType,
    status: stage >= 5 ? 'Completed' : 'In Progress',
    tailorName: existing?.tailorName,
    location: existing?.location,
    date: existing?.date || order.orderedDate,
    total: order.price ?? existing?.total,
    paymentMode: existing?.paymentMode,
    deliveryAddress: existing?.deliveryAddress,
    fabric: order.fabricDetails || existing?.fabric,
    currentStage: stage,
    currentStageText: CUSTOMER_STEPS[stage - 1] || order.status,
    pickupSlot: existing?.pickupSlot,
    timeline: buildOrderTimeline(stage),
  };
}

export function notifyCustomer(session: TailorSession, item: Omit<StudioNotification, 'timestamp' | 'isRead'> & { id?: string }) {
  return addStudioNotification(session.customerNotifications ?? [], item);
}

export function notifyTailor(session: TailorSession, item: Omit<StudioNotification, 'timestamp' | 'isRead'> & { id?: string }) {
  return addStudioNotification(session.notifications ?? [], item);
}

export function placeCustomerWorkspaceOrder(
  session: TailorSession,
  input: {
    title: string;
    tailorName: string;
    location?: string;
    total: number;
    paymentMode: string;
    deliveryAddress: string;
    fabric?: string;
    pickupSlot?: string;
    measurements?: string;
  }
): Partial<TailorSession> {
  const id = `THY-${Date.now().toString().slice(-6)}`;
  const customerName = session.customerProfile?.fullName || 'Customer';
  const order = customerOrderFromPlacement({ id, ...input });
  const request: TailorOrderRequest = {
    id: `REQ-${id.replace(/\D/g, '')}`,
    customerName,
    garmentType: input.title,
    category: 'Custom',
    requestDate: new Date().toISOString().slice(0, 10),
    fabricProvided: input.fabric ? `Yes (${input.fabric})` : 'Customer fabric / pickup',
    fabricDetails: input.fabric || 'Doorstep fabric pickup',
    measurements: input.measurements || 'Saved profile measurements',
    requirements: input.pickupSlot ? `Pickup slot: ${input.pickupSlot}` : 'Custom stitch order',
    budgetEstimate: `₹${input.total}`,
    status: 'Pending Quotation',
  };
  const studioOrder: TailorActiveOrder = {
    id,
    customerName,
    garmentType: input.title,
    status: 'In Progress',
    expectedCompletion: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
    fabricDetails: input.fabric || 'Customer fabric',
    measurements: request.measurements,
    orderedDate: order.date,
    price: input.total,
    currentStage: 1,
    specialNotes: request.requirements,
  };

  return {
    customerOrders: [order, ...session.customerOrders.filter((item) => item.id !== id)],
    requests: [request, ...session.requests.filter((item) => item.id !== request.id)],
    orders: [studioOrder, ...session.orders.filter((item) => item.id !== id)],
    customerNotifications: notifyCustomer(
      { ...session, customerNotifications: notifyCustomer(session, stamp('order', 'Order placed', `${input.title} is confirmed. Track stitching from My Orders.`, '/my-orders', `cust-order-${id}`)) },
      stamp(
        'pickup',
        'Fabric pickup scheduled',
        input.pickupSlot
          ? `Pickup is booked for the ${input.pickupSlot} slot at ${input.deliveryAddress || 'your address'}.`
          : `Doorstep fabric pickup is scheduled for ${input.title}.`,
        '/my-orders',
        `cust-pickup-${id}`
      )
    ),
    notifications: notifyTailor(
      { ...session, notifications: notifyTailor(session, stamp('request', 'New order request', `${customerName} placed ${input.title}.`, '/tailor-dashboard/new-requests', `tailor-req-${id}`)) },
      stamp('pickup', 'Fabric pickup scheduled', `Collect fabric for ${input.title} from ${customerName}.`, '/tailor-dashboard/active-orders', `tailor-pickup-${id}`)
    ),
  };
}

export function recordEstimateRequest(
  session: TailorSession,
  input: { garmentType: string; tailorName: string; description?: string }
): Partial<TailorSession> {
  const customerName = session.customerProfile?.fullName || 'Customer';
  const id = `REQ-${Date.now().toString().slice(-6)}`;
  const request: TailorOrderRequest = {
    id,
    customerName,
    garmentType: input.garmentType,
    category: 'Estimate',
    requestDate: new Date().toISOString().slice(0, 10),
    fabricProvided: 'To be discussed',
    measurements: 'Attached profile measurements',
    requirements: input.description || `Estimate requested from ${input.tailorName}`,
    status: 'Pending Quotation',
  };
  return {
    requests: [request, ...session.requests.filter((item) => item.id !== id)],
    customerNotifications: notifyCustomer(
      session,
      stamp('request', 'Estimate request sent', `Your request for ${input.garmentType} was sent to ${input.tailorName}.`, '/notifications', `cust-est-${id}`)
    ),
    notifications: notifyTailor(
      session,
      stamp('request', 'New order request', `${customerName} asked for a quote on ${input.garmentType}.`, '/tailor-dashboard/new-requests', `tailor-est-${id}`)
    ),
  };
}

export function recordQuotationForCustomer(
  session: TailorSession,
  input: { garmentType: string; customerName: string; amount: string }
): Partial<TailorSession> {
  return {
    customerNotifications: notifyCustomer(
      session,
      stamp(
        'quotation',
        'New quotation',
        `A tailor sent ₹${input.amount} for ${input.garmentType}.`,
        '/stitch-your-outfit/cart',
        `cust-quote-${input.garmentType}-${input.amount}`
      )
    ),
    notifications: notifyTailor(
      session,
      stamp('quotation', 'Quotation sent', `₹${input.amount} quote sent to ${input.customerName}.`, '/tailor-dashboard/new-requests')
    ),
  };
}

export function applyStageNotifications(
  session: TailorSession,
  order: TailorActiveOrder,
  stage: number
): Partial<TailorSession> {
  const label = ORDER_STAGES[stage - 1] || orderStatusFromStage(stage);
  const nextOrders = session.orders.map((item) =>
    item.id === order.id ? { ...item, currentStage: stage, status: orderStatusFromStage(stage) } : item
  );
  const updated = nextOrders.find((item) => item.id === order.id) || { ...order, currentStage: stage };
  const customerOrders = [
    syncCustomerOrder(updated, session.customerOrders.find((item) => item.id === order.id)),
    ...session.customerOrders.filter((item) => item.id !== order.id),
  ];

  let customerNotifications = session.customerNotifications ?? [];
  let notifications = session.notifications ?? [];

  const pushBoth = (
    customer: Omit<StudioNotification, 'timestamp' | 'isRead'>,
    tailor: Omit<StudioNotification, 'timestamp' | 'isRead'>
  ) => {
    customerNotifications = addStudioNotification(customerNotifications, customer);
    notifications = addStudioNotification(notifications, tailor);
  };

  if (stage === 2) {
    pushBoth(
      stamp('pickup', 'Fabric picked up', `Your fabric for ${order.garmentType} has been collected.`, '/my-orders', `cust-picked-${order.id}`),
      stamp('pickup', 'Material received', `Fabric for ${order.garmentType} (${order.customerName}) is in the studio.`, '/tailor-dashboard/active-orders', `tailor-mat-${order.id}`)
    );
  } else if (stage >= 5) {
    pushBoth(
      stamp('delivery', 'Stitched outfit ready', `${order.garmentType} is ready for handover.`, '/my-orders', `cust-ready-${order.id}`),
      stamp('delivery', 'Outfit ready for handover', `Give the finished ${order.garmentType} to ${order.customerName}.`, '/tailor-dashboard/active-orders', `tailor-give-${order.id}`)
    );
  } else {
    customerNotifications = addStudioNotification(
      customerNotifications,
      stamp('order', 'Order update', `${order.garmentType} is now “${label}”.`, '/my-orders', `cust-track-${order.id}-${stage}`)
    );
    notifications = addStudioNotification(
      notifications,
      stamp('order', 'Order stage updated', `${order.garmentType} for ${order.customerName} is ${label}.`, '/tailor-dashboard/active-orders', `tailor-track-${order.id}-${stage}`)
    );
  }

  return { orders: nextOrders, customerOrders, customerNotifications, notifications };
}

export function notifyFromIncomingChat(
  session: TailorSession,
  viewer: 'customer' | 'tailor',
  message: ChatMessage,
  counterpart: string
): Partial<TailorSession> | null {
  if (message.sender === viewer || message.sender === 'system') return null;

  if (message.kind === 'quotation' && viewer === 'customer') {
    return {
      customerNotifications: notifyCustomer(
        session,
        stamp(
          'quotation',
          'New quotation',
          `${counterpart} sent a quote${message.quotation?.price ? ` of ₹${message.quotation.price}` : ''}.`,
          '/chat',
          `cust-chat-quote-${message._id}`
        )
      ),
    };
  }

  const preview = (message.text || (message.kind === 'voice' ? 'Voice note' : 'New message')).slice(0, 120);
  if (viewer === 'customer') {
    return {
      customerNotifications: notifyCustomer(
        session,
        stamp('chat', `Message from ${counterpart}`, preview, '/chat', `cust-chat-${message._id}`)
      ),
    };
  }
  return {
    notifications: notifyTailor(
      session,
      stamp('chat', `Chat from ${counterpart}`, preview, '/tailor-dashboard/chat', `tailor-chat-${message._id}`)
    ),
  };
}
