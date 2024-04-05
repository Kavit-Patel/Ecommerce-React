import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./product/productSlice";
import cartReducer from "./cart/cartSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
