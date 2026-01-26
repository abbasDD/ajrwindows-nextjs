export enum PaymentMethod {
  COD = "cod",
  PAYPAL = "paypal",
}

export enum DeliveryType {
  STANDARD_SHIPPING = "standard_shipping",
  PICKUP = "pickup",
}

export enum DeliveryStatus {
  PENDING = "pending",
  SHIPPED = "shipped",
  CANCELLED = "cancelled",
  PROCESSING = "processing",
  DELIVERED = "delivered",
}
export enum Statues {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
  PAID = "paid",
}

export interface OrderTypes {
  id?: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  area: string;
  zipcode: string;
  address: string;
  delivery_type: DeliveryType.PICKUP | DeliveryType.STANDARD_SHIPPING;
  payment_method: PaymentMethod.COD | PaymentMethod.PAYPAL;
  status?:
    | DeliveryStatus.PENDING
    | DeliveryStatus.SHIPPED
    | DeliveryStatus.CANCELLED
    | DeliveryStatus.PROCESSING
    | DeliveryStatus.DELIVERED;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_status: Statues.PAID | Statues.FAILED | Statues.PENDING;
  created_at?: string;
}

export interface OrderItemTypes {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  image_url?: string;
}
