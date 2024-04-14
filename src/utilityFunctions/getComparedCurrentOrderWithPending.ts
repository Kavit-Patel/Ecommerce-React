import { orderType, productsFieldType } from "../types/types";

export const getComparedCurrentOrderWithPending = (
  pendingOrders: orderType[],
  currentOrderProducts: productsFieldType[]
) => {
  return pendingOrders.find((order) => {
    if (order.products.length !== currentOrderProducts.length) {
      return false;
    }
    const everyProductInOrderMatched = order.products.every((product) =>
      currentOrderProducts.some(
        (currentProduct) =>
          currentProduct.product._id === product.product._id &&
          currentProduct.quantity === product.quantity &&
          currentProduct.price === product.price
      )
    );
    const everyProductInCurrentOrderMatched = currentOrderProducts.every(
      (currentOrder) =>
        order.products.some(
          (product) =>
            product.product._id === currentOrder.product._id &&
            product.quantity === currentOrder.quantity &&
            product.price === currentOrder.price
        )
    );
    return everyProductInOrderMatched && everyProductInCurrentOrderMatched;
  });
};
