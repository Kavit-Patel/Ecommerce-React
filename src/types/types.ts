export interface IUserDetails {
  name: string;
  surname: string;
  email: string;
  password: string;
}
export interface IUser {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
export interface IUserResponse {
  success: boolean;
  message: string;
  response?: IUser;
}
export interface IUserLoginDetails {
  email: string;
  password: string;
}
export interface IProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  section: string;
}
export interface IProductsResponse {
  success: boolean;
  message: string;
  response?: IProduct[];
}
export interface ISingleProductResponse {
  success: boolean;
  message: string;
  response?: IProduct;
}
export interface ICartItemLocalStorage {
  user: string;
  product: IProduct;
  quantity: number;
}
export interface ICart {
  _id?: string;
  user: string;
  quantity: number;
  product: IProduct;
}
export interface ICartResponseArr {
  success: boolean;
  message: string;
  response?: ICart[];
}
export interface ICartResponseSingle {
  success: boolean;
  message: string;
  response?: ICart;
}

export interface IAddress {
  _id?: string;
  user?: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}
export interface IAddressFetchedResponse {
  success: boolean;
  message: string;
  response?: IAddress[];
}
export interface IAddAddressResponse {
  success: boolean;
  message: string;
  response?: IAddress;
}
export interface IProductsTobeOrdered {
  product: IProduct;
  quantity: number;
  price: number;
}
export interface IOrder {
  _id?: string;
  user?: string | IUser;
  products: IProductsTobeOrdered[];
  payment?: {
    payId: string | IPayment;
    paymentStatus: string;
  };
  address: string | IAddress;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt?: string;
}
export interface INewOrderResponse {
  success: boolean;
  message: string;
  response?: { newOrderWithProductsDetail: IOrder; removedCartArray: ICart[] };
}
export interface IFetchedOrdersResponse {
  success: boolean;
  message: string;
  response?: IOrder[];
}

export interface IPayment {
  _id?: string;
  user: string | IUser;
  order: string | IOrder;
  amount: number;
  payMode: string;
  paymentIntent: string;
}
export interface IPaymentResponse {
  success: boolean;
  message: string;
  response?: IPayment;
}
