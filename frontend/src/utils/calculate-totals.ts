import { Carts, Coupon } from "./types";

export const calculateTotals = (cart: Carts[], coupon: Coupon) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );
  let total = subtotal;

  if (coupon) {
    const discount = subtotal * (coupon.discount_percentage / 100);
    total = subtotal - discount;
  }
};
