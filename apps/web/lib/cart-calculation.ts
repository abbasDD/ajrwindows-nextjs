import { PromoCodeTypes } from "@/types/product-types";

export interface CartItem {
  price: number;
  quantity: number;
  discounted_price?: number;
}

export const calculateOrderTotals = (
  items: CartItem[],
  appliedPromo: PromoCodeTypes | null,
) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const productDiscountTotal = items.reduce((acc, item) => {
    if (!item.discounted_price) return acc;
    const saving = item.discounted_price * item.quantity;
    return acc + saving;
  }, 0);

  const amountAfterProductDiscounts = subtotal - productDiscountTotal;

  let promoDiscountAmount = 0;
  if (
    appliedPromo &&
    amountAfterProductDiscounts >= appliedPromo.min_order_amount
  ) {
    if (appliedPromo.type === "percentage") {
      promoDiscountAmount =
        (amountAfterProductDiscounts * appliedPromo.value) / 100;
      if (appliedPromo.max_discount > 0) {
        promoDiscountAmount = Math.min(
          promoDiscountAmount,
          appliedPromo.max_discount,
        );
      }
    } else {
      promoDiscountAmount = appliedPromo.value;
    }
  }
  const totalSavings = productDiscountTotal + promoDiscountAmount;
  const finalTotal = subtotal - totalSavings;

  return {
    subtotal,
    productDiscountTotal,
    promoDiscountAmount,
    totalSavings,
    finalTotal,
  };
};
