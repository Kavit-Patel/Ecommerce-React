import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./product/productSlice";
import cartReducer from "./cart/cartSlice";
import userReducer from "./user/userSlice";
import addressReducer from "./address/addressSlice";
import orderReducer from "./order/orderSlice";
import paymentReducer from "./payment/paymentSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
    address: addressReducer,
    order: orderReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
