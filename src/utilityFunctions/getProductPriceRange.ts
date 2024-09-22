import { IProduct } from "../types/types";

export const productsPriceRange = (data: IProduct[] | undefined) => {
  if (data) {
    const range = data.map((product) => product.price).sort();
    return range;
  }
  return [10000, 0];
};
