export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export interface PersistedOrder {
  id: string;
  garmentName: string;
  tailorName: string;
  amountPaise: number;
  currency: 'INR';
  paymentStatus: PaymentStatus;
  fulfillmentStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  razorpayOrderId: string | null;
  createdAt: string;
}

export interface CreatePaymentOrderInput { checkoutKey: string; sourceThreadId?: string; tailorName: string; garmentName: string; deliveryAddress: string; amountPaise: number; }
export interface RazorpayCheckoutResponse { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }
export interface RazorpayOptions { key: string; amount: number; currency: string; name: string; description: string; order_id: string; handler: (response: RazorpayCheckoutResponse) => void; modal?: { ondismiss: () => void }; prefill?: { contact?: string; email?: string; name?: string }; theme?: { color: string }; }
declare global { interface Window { Razorpay?: new (options: RazorpayOptions) => { open: () => void }; } }
