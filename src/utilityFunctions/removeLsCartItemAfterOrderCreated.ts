import { updateCartItem } from "./localStorageCRUD";

interface cartIdtype {
  user: string;
  product: string;
  quantity: number;
}
export const removeLsCartItemAfterOrderCreated = (
  removedCartArr: cartIdtype[]
) => {
  removedCartArr.forEach((removedCartItem) => {
    updateCartItem(removedCartItem.product, removedCartItem.user, "remove");
  });
};
