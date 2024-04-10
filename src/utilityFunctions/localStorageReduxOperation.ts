import { LsCartType, fullCartItemType, productType } from "../types/types";
import { getCartItems } from "./localStorageCRUD";

export const getFullCartItemsFromLs = (
  products: productType[],
  cartItemdb: fullCartItemType[]
) => {
  const lsCart: LsCartType[] = getCartItems();

  let fullCartItemsLs: fullCartItemType[] =
    lsCart.length > 0 && products.length > 0
      ? lsCart.map((lsItem) => {
          const matched = products.find(
            (product) => product._id === lsItem.productId
          );
          if (!matched) {
            return {
              user: lsItem.user,
              quantity: lsItem.quantity,
              product: {
                _id: lsItem.productId,
                name: "",
                price: 0,
                image: "",
                section: "",
              },
            };
          }
          return {
            user: lsItem.user,
            quantity: lsItem.quantity,
            product: {
              _id: lsItem.productId,
              name: matched.name,
              price: matched.price,
              image: matched.image,
              section: matched.section,
            },
          };
        })
      : [];
  //Adding Cart _id from database to localStorage items
  fullCartItemsLs = fullCartItemsLs.map((item) => {
    const matched = cartItemdb.find(
      (dbItem) => dbItem.product._id === item.product._id
    );
    if (matched) {
      return { ...item, _id: matched._id };
    }
    return item;
  });
  return fullCartItemsLs;
};
