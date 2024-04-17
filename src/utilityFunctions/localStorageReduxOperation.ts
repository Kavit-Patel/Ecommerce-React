import { LsCartType, fullCartItemType, productType } from "../types/types";
import { getCartItems } from "./localStorageCRUD";

export const getFullCartItemsFromLs = (
  products: productType[],
  cartItemdb: fullCartItemType[],
  userId: string | undefined
) => {
  const lsCart: LsCartType[] = getCartItems();

  //if db cart has extra item then adding it to lsCart
  const userLsCart = lsCart.filter((item) => item.user === userId);
  const userDbCart = cartItemdb.map((item) => ({
    productId: item.product._id,
    user: item.user,
    quantity: item.quantity,
  })); // making db cart of user as lsCartType to match for next logic
  const userCart = [...userLsCart, ...userDbCart];
  //To productify local storage items
  let fullCartItemsLs: fullCartItemType[] =
    userCart.length > 0 && products.length > 0
      ? userCart.map((lsItem) => {
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

export const getItemProductify = (
  itemArr: LsCartType[],
  products: productType[],
  cartItemdb: fullCartItemType[]
) => {
  // const lsCart: LsCartType[] = getCartItems();

  //To productify itemArry's items storage items
  let fullCartItemsLs: fullCartItemType[] =
    itemArr.length > 0 && itemArr.length > 0
      ? itemArr.map((lsItem) => {
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
