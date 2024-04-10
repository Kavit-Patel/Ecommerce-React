import { fullCartItemType } from "../types/types";

export const calcCartItemDiffLsDs = (
  cartItemsLs: fullCartItemType[],
  cartItemsDb: fullCartItemType[]
) => {
  return cartItemsLs.filter(
    (Lsitem) =>
      !cartItemsDb.some((dbItem) => {
        if (dbItem.product._id === Lsitem.product._id) {
          return true;
        } else {
          return false;
        }
      })
  );
};
export const calcCartItemQuantityDiffLsDs = (
  cartItemsLs: fullCartItemType[],
  cartItemsDb: fullCartItemType[]
) => {
  return cartItemsLs.filter((lsItem) => {
    return cartItemsDb.some(
      (dbItem) =>
        dbItem._id === lsItem._id && dbItem.quantity !== lsItem.quantity
    );
  });
};
