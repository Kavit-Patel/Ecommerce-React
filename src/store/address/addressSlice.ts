import { createSlice } from "@reduxjs/toolkit";
import { addressType } from "../../types/types";
import {
  addNewAddress,
  deleteUserAddress,
  fetchUserAddress,
  updateUserAddress,
} from "./addressApi";
import { toast } from "react-toastify";

interface initialStateType {
  addresses: addressType[];
  createdStatus: "idle" | "pending" | "success" | "error";
  fetchedStatus: "idle" | "pending" | "success" | "error";
  updateStatus: "idle" | "pending" | "success" | "error";
  deleteStatus: "idle" | "pending" | "success" | "error";
}
const initialState: initialStateType = {
  addresses: [],
  createdStatus: "idle",
  fetchedStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.createdStatus = "success";
        state.addresses = [...state.addresses, action.payload];
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.createdStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(addNewAddress.pending, (state) => {
        state.createdStatus = "pending";
      })
      .addCase(fetchUserAddress.fulfilled, (state, action) => {
        state.fetchedStatus = "success";
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddress.rejected, (state, action) => {
        state.fetchedStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(fetchUserAddress.pending, (state) => {
        state.fetchedStatus = "pending";
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.addresses = state.addresses.map((address) => {
          if (address._id === action.payload._id) {
            return action.payload;
          }
          return address;
        });
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.updateStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(updateUserAddress.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.deleteStatus = "success";
        const index = state.addresses.findIndex(
          (address) => address._id === action.payload._id
        );
        if (index) {
          state.addresses.splice(index, 1);
        }
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.deleteStatus = "error";
        toast.error(action.error.message);
      })
      .addCase(deleteUserAddress.pending, (state) => {
        state.deleteStatus = "pending";
      });
  },
});

// export const { setAddress } = addressSlice.actions;
export default addressSlice.reducer;
