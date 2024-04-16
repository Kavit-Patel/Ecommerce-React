import { LsCartType, LsCartTypeVanillaUser } from "../types/types";
import {
  addVanillaCartToLs,
  getCartItems,
  updateCartItem,
  updateVanillaCartItemQuantityToLs,
} from "./localStorageCRUD";

export const vanillaUserCartAddition = (
  vanillaCart: LsCartTypeVanillaUser[],
  userId: string
) => {
  const currentLs: LsCartType[] = getCartItems();
  vanillaCart = vanillaCart.map((item) => ({ ...item, user: userId }));
  const newVanillaItemTobeAdded = vanillaCart.filter(
    (vanillaItem) =>
      !currentLs.some(
        (currentCartItem) =>
          currentCartItem.user === vanillaItem.user &&
          currentCartItem.productId === vanillaItem._id
      )
  );
  const vanillaUserItemTobeRemoved = currentLs
    .filter((currentCartItem) =>
      vanillaCart.some(
        (vanillaItem) => vanillaItem.user === currentCartItem.user
      )
    )
    .filter(
      (currentCartItem) =>
        !vanillaCart.some(
          (vanillaItem) => vanillaItem._id === currentCartItem.productId
        )
    );
  const itemsWithquantityDiff = vanillaCart.filter((vanillaItem) =>
    currentLs.some(
      (currentCartItem) =>
        currentCartItem.user === vanillaItem.user &&
        currentCartItem.productId === vanillaItem._id &&
        currentCartItem.quantity !== vanillaItem.quantity
    )
  );
  if (newVanillaItemTobeAdded.length > 0) {
    newVanillaItemTobeAdded.forEach((item) => {
      addVanillaCartToLs(userId, item._id, item.quantity);
    });
  }
  if (itemsWithquantityDiff.length > 0) {
    itemsWithquantityDiff.forEach((item) => {
      updateVanillaCartItemQuantityToLs(userId, item._id, item.quantity);
    });
  }
  if (vanillaUserItemTobeRemoved.length > 0) {
    vanillaUserItemTobeRemoved.forEach((item) => {
      if (typeof item.user === "string") {
        updateCartItem(item.productId, item.user, "remove");
      } else {
        updateCartItem(item.productId, item.user._id, "remove");
      }
    });
  }
  return vanillaUserItemTobeRemoved;
};
