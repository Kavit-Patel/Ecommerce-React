import { createSlice } from "@reduxjs/toolkit";
import { CartType } from "../../types/types";

interface initialStateType {
  cartItems: CartType[];
}

const initialState: initialStateType = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
  },
});

export const { setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
