import { localStorageCartType } from "../types/types";

export const getCartItems = () => {
  const storedItems = localStorage.getItem("ecommerceCart");
  if (storedItems) {
    return JSON.parse(storedItems);
  } else {
    localStorage.setItem("ecommerceCart", "[]");
    return [];
  }
};

export const addToCartLs = (id: string) => {
  const storedItems = getCartItems();

  const alreadyExists = getCartItems().find(
    (item: localStorageCartType) => item._id == id
  );
  if (alreadyExists) {
    const updatedCart = storedItems.map((item: localStorageCartType) => {
      if (item._id === alreadyExists._id) {
        item.quantity = alreadyExists.quantity + 1;
      }
      return item;
    });
    localStorage.setItem("ecommerceCart", JSON.stringify(updatedCart));
  } else {
    localStorage.setItem(
      "ecommerceCart",
      JSON.stringify([...storedItems, { _id: id, quantity: 1 }])
    );
  }
};
export const updateCartItem = (id: string, operation: string) => {
  let updatedCart: localStorageCartType[] = getCartItems();
  if (operation === "remove") {
    const index = getCartItems().findIndex(
      (item: localStorageCartType) => item._id === id
    );
    updatedCart.splice(index, 1);
  } else {
    updatedCart = updatedCart.map((element: localStorageCartType) => {
      if (element._id === id) {
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
