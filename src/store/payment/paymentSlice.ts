import { createSlice } from "@reduxjs/toolkit";
import {
  createPaymentIntent,
  getExistingPaymentIntent,
  paymentSuccessed,
} from "./paymentApi";
import { toast } from "react-toastify";
import { paymentType } from "../../types/types";

export interface paymentIntentType {
  clientSecret: string | undefined;
  paymentObject: paymentType | undefined;
  createdStatus: "idle" | "success" | "pending" | "error";
  fetchedStatus: "idle" | "success" | "pending" | "error";
  paymentSuccedStatus: "idle" | "success" | "pending" | "error";
}

const initialState: paymentIntentType = {
  clientSecret: undefined,
  paymentObject: undefined,
  createdStatus: "idle",
  fetchedStatus: "idle",
  paymentSuccedStatus: "idle",
};
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.clientSecret = action.payload.paymentIntent;
        state.paymentObject = action.payload;
        state.createdStatus = "success";
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.createdStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.createdStatus = "pending";
      })
      .addCase(getExistingPaymentIntent.fulfilled, (state, action) => {
        state.clientSecret = action.payload.paymentIntent;
        state.paymentObject = action.payload;
        state.fetchedStatus = "success";
      })
      .addCase(getExistingPaymentIntent.rejected, (state, action) => {
        state.fetchedStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(getExistingPaymentIntent.pending, (state) => {
        state.fetchedStatus = "pending";
      })
      .addCase(paymentSuccessed.fulfilled, (state, action) => {
        state.paymentSuccedStatus = "success";
        state.paymentObject = action.payload;
      })
      .addCase(paymentSuccessed.rejected, (state, action) => {
        state.paymentSuccedStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(paymentSuccessed.pending, (state) => {
        state.paymentSuccedStatus = "pending";
      });
  },
});
export const { setClientSecret } = paymentSlice.actions;
export default paymentSlice.reducer;
