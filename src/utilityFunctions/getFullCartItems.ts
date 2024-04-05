import { CartType, localStorageCartType, productType } from "../types/types";
import { getCartItems } from "./cartLocalStorage";

export const getFullCartItems = (products: productType[]) => {
  const cartItemsFromLs = getCartItems();
  return products?.length > 0
    ? products
        ?.filter((product) => {
          return cartItemsFromLs?.some(
            (cartProduct: localStorageCartType) =>
              cartProduct._id === product._id
          );
        })
        .map((product: CartType) => {
          const match = cartItemsFromLs?.find(
            (el: localStorageCartType) => el._id === product._id
          );
          if (match) {
            product = { ...product, quantity: match.quantity };
          }
          return product;
        })
    : [];
};
