import { IProduct } from "../types/types";

export const productsPriceRange = (data: IProduct[] | undefined) => {
  if (data) {
    const range = data
      .filter((product) => product.section === "Products")
      .map((product) => product.price)
      .sort((a, b) => Number(b) - Number(a));
    return range;
  }
  return [10000, 0];
};
