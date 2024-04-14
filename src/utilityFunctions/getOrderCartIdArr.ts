import { fullCartItemType } from "../types/types";

export const getOrderCartIdArr = (cartItemsDb: fullCartItemType[]) => {
  return cartItemsDb.map((item) => {
    if (item._id) {
      return item._id;
    } else {
      return "123"; /// returning random string as cart Id to get rid of type error it is handled in backend
    }
  });
};
