export interface productType {
  _id: string;
  name: string;
  price: number;
  image: string;
  section: string;
}
export interface dataType {
  products: productType[];
  status: "idle" | "loading" | "success" | "error";
}
export interface Cart extends productType {
  quantity?: number;
}
