import { createSlice } from "@reduxjs/toolkit";
import { createPaymentIntent, getExistingPaymentIntent } from "./paymentApi";
import { toast } from "react-toastify";

export interface paymentIntentType {
  clientSecret: string | undefined;
  createdStatus: "idle" | "success" | "pending" | "error";
  fetchedStatus: "idle" | "success" | "pending" | "error";
}

const initialState: paymentIntentType = {
  clientSecret: undefined,
  createdStatus: "idle",
  fetchedStatus: "idle",
};
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.clientSecret = action.payload.paymentIntent;
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
        state.fetchedStatus = "success";
      })
      .addCase(getExistingPaymentIntent.rejected, (state, action) => {
        state.fetchedStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(getExistingPaymentIntent.pending, (state) => {
        state.fetchedStatus = "pending";
      });
  },
});
export default paymentSlice.reducer;
