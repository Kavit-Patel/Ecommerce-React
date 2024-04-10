import { fullCartItemType } from "../types/types";

export const getOrderSummary = (products: fullCartItemType[]) => {
  if (products.length > 0) {
    const subtotal = products.reduce(
      (acc, el) => acc + el.product.price * (el.quantity || 1),
      0
    );
    const tax = +(
      subtotal > 14000
        ? (subtotal / 100) * 28
        : subtotal > 4000
        ? (subtotal / 100) * 18
        : (subtotal / 100) * 10
    ).toFixed(0);
    const shipping = subtotal > 999 ? 49 : 170;
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  } else {
    return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
  }
};
