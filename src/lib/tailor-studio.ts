import {
  DEFAULT_AVAILABILITY,
  DEFAULT_ORDERS,
  DEFAULT_PAYOUTS,
  DEFAULT_REQUESTS,
  DEFAULT_SCHEDULE,
  DEFAULT_WORKING_DAYS,
  type DayHours,
  type OrderStatus,
  type StudioNotification,
  type StudioPayout,
  type TailorActiveOrder,
  type TailorAvailability,
  type TailorOrderRequest,
  type TailorSession,
  type WorkingDay,
} from '@/lib/tailor-session';

export const ORDER_STAGES = [
  'Order Confirmed',
  'Material Received',
  'Stitching in Progress',
  'Quality Check',
  'Ready for Delivery',
] as const;

export function normalizeAvailability(value?: Partial<TailorAvailability> | null): TailorAvailability {
  const workingDays = { ...DEFAULT_WORKING_DAYS, ...value?.workingDays };
  const schedule =
    Array.isArray(value?.schedule) && value.schedule.length
      ? DEFAULT_SCHEDULE.map((day) => {
          const match = value.schedule?.find((item) => item.day === day.day);
          return match ? { ...day, ...match } : day;
        })
      : DEFAULT_SCHEDULE.map((day) => ({
          ...day,
          isOpen: workingDays[day.day],
        }));
  return {
    isAvailable: value?.isAvailable ?? DEFAULT_AVAILABILITY.isAvailable,
    vacationMode: value?.vacationMode ?? false,
    workingDays: Object.fromEntries(schedule.map((day) => [day.day, day.isOpen])) as Record<WorkingDay, boolean>,
    maxActiveCapacity: value?.maxActiveCapacity ?? DEFAULT_AVAILABILITY.maxActiveCapacity,
    schedule,
  };
}

export function pendingRequests(requests: TailorOrderRequest[]): TailorOrderRequest[] {
  return requests.filter((request) => request.status === 'Pending Quotation');
}

export function visibleRequests(requests: TailorOrderRequest[]): TailorOrderRequest[] {
  return requests.filter((request) => request.status !== 'Declined');
}

export function activeOrders(orders: TailorActiveOrder[]): TailorActiveOrder[] {
  return orders.filter((order) => order.status !== 'Completed');
}

export function completedOrders(orders: TailorActiveOrder[]): TailorActiveOrder[] {
  return orders.filter((order) => order.status === 'Completed' || order.currentStage === 5);
}

export function orderStatusFromStage(stage: number): OrderStatus {
  if (stage >= 5) return 'Completed';
  if (stage === 4) return 'Ready to Stitch/Deliver';
  if (stage === 2) return 'Fitting Scheduled';
  return 'In Progress';
}

export function formatRupee(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN')}`;
}

export function payoutsFromOrders(orders: TailorActiveOrder[], existing: StudioPayout[]): StudioPayout[] {
  const byOrder = new Map(existing.map((item) => [item.orderId, item]));
  for (const order of completedOrders(orders)) {
    if (byOrder.has(order.id)) continue;
    const amount = order.price ?? 0;
    byOrder.set(order.id, {
      id: `TXN-${order.id}`,
      orderId: order.id,
      customerName: order.customerName,
      garmentType: order.garmentType,
      date: order.expectedCompletion,
      amount,
      status: 'Pending',
    });
  }
  return Array.from(byOrder.values());
}

export function earningsSummary(payouts: StudioPayout[], orders: TailorActiveOrder[]) {
  const paid = payouts.filter((item) => item.status === 'Paid');
  const pending = payouts.filter((item) => item.status === 'Pending');
  const totalRevenue = paid.reduce((sum, item) => sum + item.amount, 0);
  const pendingPayout = pending.reduce((sum, item) => sum + item.amount, 0);
  const platformFees = Math.round(totalRevenue * 0.1);
  const completed = completedOrders(orders);
  return {
    totalRevenue,
    platformFees,
    netEarnings: totalRevenue - platformFees,
    pendingPayout,
    completedCount: completed.length,
    averageOrder: completed.length ? Math.round(totalRevenue / Math.max(paid.length, 1)) : 0,
  };
}

export function addStudioNotification(
  current: StudioNotification[],
  notification: Omit<StudioNotification, 'id' | 'timestamp' | 'isRead'> & { id?: string }
): StudioNotification[] {
  const next: StudioNotification = {
    id: notification.id || `notif-${Date.now()}`,
    type: notification.type,
    title: notification.title,
    description: notification.description,
    linkUrl: notification.linkUrl,
    timestamp: 'Just now',
    isRead: false,
  };
  return [next, ...current.filter((item) => item.id !== next.id)].slice(0, 20);
}

export function requestToOrder(request: TailorOrderRequest, quotePrice: number, days: number): TailorActiveOrder {
  const due = new Date();
  due.setDate(due.getDate() + Math.max(1, days));
  return {
    id: `ORD-${request.id.replace(/\D/g, '') || Date.now().toString().slice(-4)}`,
    customerName: request.customerName,
    garmentType: request.garmentType,
    status: 'In Progress',
    expectedCompletion: due.toISOString().slice(0, 10),
    fabricDetails: request.fabricDetails || request.fabricProvided,
    measurements: request.measurements,
    orderedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    price: quotePrice,
    currentStage: 1,
    specialNotes: request.requirements,
    designPreview: request.designPreview,
  };
}

export function hoursSummary(availability: TailorAvailability): string {
  const open = availability.schedule.filter((day) => day.isOpen);
  if (!availability.isAvailable || availability.vacationMode) return 'Temporarily unavailable';
  if (!open.length) return 'Closed this week';
  const first = open[0];
  return `${open.length} days · ${first.openTime}–${first.closeTime}`;
}

export function ensureStudioWorkspace(session: TailorSession): Partial<TailorSession> | null {
  if (session.role !== 'tailor' || session.studioBootstrapped) return null;
  return {
    studioBootstrapped: true,
    requests: session.requests?.length ? session.requests : DEFAULT_REQUESTS.map((item) => ({ ...item })),
    orders: session.orders?.length ? session.orders : DEFAULT_ORDERS.map((item) => ({ ...item })),
    notifications: session.notifications?.length
      ? session.notifications
      : (session.requests?.length ? session.requests : DEFAULT_REQUESTS).map((request) => ({
          id: `notif-req-${request.id}`,
          type: 'request' as const,
          title: 'New order request',
          description: `${request.customerName} requested ${request.garmentType}.`,
          timestamp: request.requestDate || 'Just now',
          isRead: false,
          linkUrl: '/tailor-dashboard/new-requests',
        })),
    payouts: session.payouts?.length ? session.payouts : DEFAULT_PAYOUTS.map((item) => ({ ...item })),
    availability: normalizeAvailability(session.availability),
  };
}

export function schedulePayload(schedule: DayHours[]) {
  return schedule.map((day) => ({
    day: day.day,
    isOpen: day.isOpen,
    openTime: day.openTime,
    closeTime: day.closeTime,
  }));
}
