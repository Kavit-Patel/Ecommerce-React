import { createSlice } from "@reduxjs/toolkit";
import { orderType } from "../../types/types";
import {
  addNewOrder,
  getSingleUserOrder,
  getUserOrders,
  getUserPendingOrder,
} from "./orderApi";
import { toast } from "react-toastify";

interface initialStateType {
  currentOrder: orderType | null;
  pendingOrders: orderType[];
  allOrders: orderType[];
  comparedOrder: orderType | null;
  comparedOrderStatus: "idle" | "compared";
  createdStatus: "idle" | "pending" | "success" | "error";
  fetchedPendingOrderStatus: "idle" | "pending" | "success" | "error";
  allOrderFetchingStatus: "idle" | "pending" | "success" | "error";
  singleOrderFetchingStatus: "idle" | "pending" | "success" | "error";
}
const initialState: initialStateType = {
  currentOrder: null,
  pendingOrders: [],
  allOrders: [],
  comparedOrder: null,
  comparedOrderStatus: "idle",
  createdStatus: "idle",
  fetchedPendingOrderStatus: "idle",
  allOrderFetchingStatus: "idle",
  singleOrderFetchingStatus: "idle",
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
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.allOrderFetchingStatus = "success";
        state.allOrders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.allOrderFetchingStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(getUserOrders.pending, (state) => {
        state.allOrderFetchingStatus = "pending";
      })
      .addCase(getSingleUserOrder.fulfilled, (state, action) => {
        state.singleOrderFetchingStatus = "success";
        state.currentOrder = action.payload;
      })
      .addCase(getSingleUserOrder.rejected, (state, action) => {
        state.singleOrderFetchingStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(getSingleUserOrder.pending, (state) => {
        state.singleOrderFetchingStatus = "pending";
      });
  },
});

export const { setComparedOrder } = orderSlice.actions;
export default orderSlice.reducer;
