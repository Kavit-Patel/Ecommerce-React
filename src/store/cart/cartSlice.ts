import { createSlice } from "@reduxjs/toolkit";
import { fullCartItemType } from "../../types/types";
import {
  addToCart,
  decreaseQuantity,
  getCartFromDb,
  increaseQuantity,
  removeItem,
  syncLsCartQuantityToDb,
  syncLsCartToDb,
} from "./cartApi";

interface initialStateType {
  cartItemsDb: fullCartItemType[];
  statusDb: "idle" | "success" | "pending" | "error";
  cartItemsLs: fullCartItemType[];
  statusLs: "idle" | "success" | "pending" | "error";
  statusItemSync: "idle" | "success" | "pending" | "error";
  statusItemQuantitySync: "idle" | "success" | "pending" | "error";
}

const initialState: initialStateType = {
  cartItemsDb: [],
  statusDb: "idle",
  cartItemsLs: [],
  statusLs: "idle",
  statusItemSync: "idle",
  statusItemQuantitySync: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    userLogOut: (state) => {
      state.statusDb = "idle";
      state.cartItemsDb = [];
    },
    setCartItemLs: (state, action) => {
      if (action.payload.length === 0) {
        state.statusLs = "idle";
      } else {
        state.statusLs = "success";
      }
      state.cartItemsLs = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addToCart.fulfilled, (state) => {
        state.statusDb = "success";
      })
      .addCase(addToCart.rejected, (state) => {
        state.statusDb = "error";
      })
      .addCase(addToCart.pending, (state) => {
        state.statusDb = "pending";
      })
      .addCase(getCartFromDb.fulfilled, (state, action) => {
        state.statusDb = "success";
        state.cartItemsDb = action.payload;
      })
      .addCase(getCartFromDb.rejected, (state) => {
        state.statusDb = "error";
      })
      .addCase(getCartFromDb.pending, (state) => {
        state.statusDb = "pending";
      })
      .addCase(syncLsCartToDb.fulfilled, (state, action) => {
        state.statusItemSync = "success";
        state.cartItemsDb = [...state.cartItemsDb, ...action.payload];
      })
      .addCase(syncLsCartToDb.rejected, (state) => {
        state.statusItemSync = "error";
      })
      .addCase(syncLsCartToDb.pending, (state) => {
        state.statusItemSync = "pending";
      })
      .addCase(syncLsCartQuantityToDb.fulfilled, (state, action) => {
        state.statusItemSync = "success";
        state.cartItemsDb = state.cartItemsDb.map((item) => {
          const matched = action.payload.find(
            (el: fullCartItemType) => el._id === item._id
          );
          if (matched) {
            return { ...item, quantity: matched.quantity };
          }
          return item;
        });
      })
      .addCase(syncLsCartQuantityToDb.rejected, (state) => {
        state.statusItemSync = "error";
      })
      .addCase(syncLsCartQuantityToDb.pending, (state) => {
        state.statusItemSync = "pending";
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.statusDb = "success";
        state.cartItemsDb = state.cartItemsDb.map((item) => {
          if (item._id === action.payload._id) {
            return { ...item, quantity: action.payload.quantity };
          }
          return item;
        });
      })
      .addCase(increaseQuantity.rejected, (state) => {
        state.statusDb = "error";
      })
      .addCase(increaseQuantity.pending, (state) => {
        state.statusDb = "pending";
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.statusDb = "success";
        state.cartItemsDb = state.cartItemsDb.map((item) => {
          if (item._id === action.payload._id) {
            return { ...item, quantity: action.payload.quantity };
          }
          return item;
        });
      })
      .addCase(decreaseQuantity.rejected, (state) => {
        state.statusDb = "error";
      })
      .addCase(removeItem.pending, (state) => {
        state.statusDb = "pending";
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.statusDb = "success";
        const index = state.cartItemsDb.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.cartItemsDb = [
            ...state.cartItemsDb.slice(0, index),
            ...state.cartItemsDb.slice(index + 1),
          ];
        }
      })
      .addCase(removeItem.rejected, (state) => {
        state.statusDb = "error";
      });
  },
});

export const { userLogOut, setCartItemLs } = cartSlice.actions;
export default cartSlice.reducer;
