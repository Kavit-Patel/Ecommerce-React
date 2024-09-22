import { toast } from "react-toastify";
import { ICart, IProduct } from "../types/types";

export const getCartItems = (key?: string) => {
  const storedItems = localStorage.getItem(key || "ecommerceCart");
  if (storedItems) {
    return JSON.parse(storedItems);
  }
  localStorage.setItem("ecommerceCart", "[]");
  return [];
};
export const addVanillaCartToLs = (
  userId: string | undefined,
  productId: string,
  quantity: number
) => {
  const storedItems = getCartItems();
  localStorage.setItem(
    "ecommerceCart",
    JSON.stringify([
      ...storedItems,
      { productId: productId, user: userId, quantity },
    ])
  );
};
// export const updateVanillaCartItemQuantityToLs = (
//   userId: string,
//   productId: string,
//   quantity: number
// ) => {
//   const storedItems = getCartItems();
//   const updatedCart = storedItems.map((item: ICart) => {
//     if (item.user === userId && item.productId === productId) {
//       item.quantity = quantity;
//     }
//     return item;
//   });
//   localStorage.setItem("ecommerceCart", JSON.stringify(updatedCart));
// };

export const addToCartLs = (userId: string, product: IProduct) => {
  const storedItems: ICart[] = getCartItems();

  const alreadyExists: ICart | undefined = getCartItems().find(
    (item: ICart) => item.product._id === product._id && item.user === userId
  );
  if (alreadyExists) {
    const updatedCart = storedItems.map((item: ICart) => {
      if (item.product._id === alreadyExists.product._id) {
        item.quantity = alreadyExists.quantity + 1;
      }
      return item;
    });
    localStorage.setItem("ecommerceCart", JSON.stringify(updatedCart));
  } else {
    localStorage.setItem(
      "ecommerceCart",
      JSON.stringify([
        { product: product, user: userId, quantity: 1 },
        ...storedItems,
      ])
    );
  }
};
export const updateCartItem = (cartItem: ICart, operation: string) => {
  if (!cartItem.product._id || !cartItem.user! || !operation) {
    toast.error("Please Provide all details to update cart Locally !");
  }
  let updatedCart: ICart[] = getCartItems();
  if (operation === "remove") {
    const index = getCartItems().findIndex(
      (item: ICart) =>
        item.product._id === cartItem.product._id && item.user === cartItem.user
    );
    updatedCart.splice(index, 1);
  } else {
    updatedCart = updatedCart.map((element: ICart) => {
      if (element.product._id === cartItem.product._id) {
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
