import { fullCartItemType, productType } from "../types/types";

export const getOrderProducts = (cartItemDb: fullCartItemType[]) => {
  return cartItemDb.reduce(
    (
      acc: {
        product: productType;
        quantity: number;
        price: number;
      }[],
      product: fullCartItemType
    ) => {
      const prod = {
        product: product.product,
        quantity: product.quantity,
        price: product.product.price * product.quantity,
      };
      acc.push(prod);
      return acc;
    },
    []
  );
};
