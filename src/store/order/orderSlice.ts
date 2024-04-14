import { createSlice } from "@reduxjs/toolkit";
import { orderType } from "../../types/types";
import { addNewOrder, getUserPendingOrder } from "./orderApi";
import { toast } from "react-toastify";

interface initialStateType {
  currentOrder: orderType | null;
  pendingOrders: orderType[];
  comparedOrder: orderType | null;
  comparedOrderStatus: "idle" | "compared";
  createdStatus: "idle" | "pending" | "success" | "error";
  fetchedPendingOrderStatus: "idle" | "pending" | "success" | "error";
}
const initialState: initialStateType = {
  currentOrder: null,
  pendingOrders: [],
  comparedOrder: null,
  comparedOrderStatus: "idle",
  createdStatus: "idle",
  fetchedPendingOrderStatus: "idle",
};
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setComparedOrder: (state, action) => {
      state.currentOrder = action.payload; // If  order to be processed already present in db and payment pending it re-assign to currentOrder state to display in order page
      state.comparedOrder = action.payload; // If  order to be processed already present in db it assign to comparedOrder state which prevents addNewOrder dispatch
      state.comparedOrderStatus = "compared";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewOrder.fulfilled, (state, action) => {
        state.createdStatus = "success";
        state.currentOrder = action.payload; //If  order to be processed  not present in db it will created and saved in db and assign to currentOrder state to display in order page
      })
      .addCase(addNewOrder.rejected, (state, action) => {
        state.createdStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(addNewOrder.pending, (state) => {
        state.createdStatus = "pending";
      })
      .addCase(getUserPendingOrder.fulfilled, (state, action) => {
        state.fetchedPendingOrderStatus = "success";
        state.pendingOrders = action.payload;
      })
      .addCase(getUserPendingOrder.rejected, (state, action) => {
        state.fetchedPendingOrderStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(getUserPendingOrder.pending, (state) => {
        state.fetchedPendingOrderStatus = "pending";
      });
  },
});

export const { setComparedOrder } = orderSlice.actions;
export default orderSlice.reducer;
