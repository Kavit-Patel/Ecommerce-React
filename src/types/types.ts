export interface userType {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

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
export interface fullCartItemType {
  _id?: string;
  user: string | userType;
  quantity: number;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    section: string;
  };
}
export interface DbCartType {
  _id?: string;
  product: string | productType;
  quantity?: number;
}
export interface LsCartType {
  productId: string;
  user: string | userType;
  quantity: number;
}
