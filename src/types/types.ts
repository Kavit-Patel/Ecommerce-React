export interface productType {
  _id: string;
  name: string;
  price: number;
  image: string;
  section: string;
}
export interface dataType {
  products: productType[];
  product: productType | null;
  productsStatus: "idle" | "loading" | "success" | "error";
  productStatus: "idle" | "loading" | "success" | "error";
  productsPriceRange: number[];
}
export interface Cart extends productType {
  quantity?: number;
}
