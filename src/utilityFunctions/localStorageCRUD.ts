import { toast } from "react-toastify";
import { LsCartType } from "../types/types";

export const getCartItems = () => {
  const storedItems = localStorage.getItem("ecommerceCart");
  if (storedItems) {
    return JSON.parse(storedItems);
  } else {
    localStorage.setItem("ecommerceCart", "[]");
    return [];
  }
};

export const addToCartLs = (userId: string | undefined, productId: string) => {
  const storedItems = getCartItems();

  const alreadyExists = getCartItems().find(
    (item: LsCartType) => item.productId === productId && item.user === userId
  );
  if (alreadyExists) {
    const updatedCart = storedItems.map((item: LsCartType) => {
      if (item.productId === alreadyExists._id) {
        item.quantity = alreadyExists.quantity + 1;
      }
      return item;
    });
    localStorage.setItem("ecommerceCart", JSON.stringify(updatedCart));
  } else {
    localStorage.setItem(
      "ecommerceCart",
      JSON.stringify([
        ...storedItems,
        { productId: productId, user: userId, quantity: 1 },
      ])
    );
  }
};
export const updateCartItem = (
  productId: string,
  userId: string | undefined,
  operation: string
) => {
  if (!productId || !userId! || !operation) {
    toast.error("Please Provide all details to update cart !");
  }
  let updatedCart: LsCartType[] = getCartItems();
  if (operation === "remove") {
    const index = getCartItems().findIndex(
      (item: LsCartType) => item.productId === productId && item.user === userId
    );
    updatedCart.splice(index, 1);
  } else {
    updatedCart = updatedCart.map((element: LsCartType) => {
      if (element.productId === productId) {
        element.quantity =
          operation === "increase"
            ? element.quantity + 1
            : operation === "decrease" && element.quantity > 1
            ? element.quantity - 1
            : element.quantity;
      }
      return element;
    });
  }

  localStorage.setItem("ecommerceCart", JSON.stringify(updatedCart));
  return updatedCart;
};
