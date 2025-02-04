import { Carts, Coupon } from "./types";

export const calculateTotals = (cart: Carts[], coupon: Coupon | null) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  let total = subtotal;

  if (coupon) {
    const discount = subtotal * (coupon.discount_percentage / 100);
    total = subtotal - discount;
  }
  return { subtotal, total };
};
