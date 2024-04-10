import { createSlice } from "@reduxjs/toolkit";
import { userType } from "../../types/types";
import { toast } from "react-toastify";
import { fetchAsyncUser, registerAsyncUser } from "./userApi";

interface initialStateType {
  user: userType | null;
  status: "idle" | "success" | "pending" | "error";
}

const initialState: initialStateType = {
  user: null,
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = "idle";
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(fetchAsyncUser.rejected, (state, action) => {
        state.status = "error";
        toast.error(action.error.message);
      })
      .addCase(fetchAsyncUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(registerAsyncUser.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(registerAsyncUser.rejected, (state, action) => {
        state.status = "error";
        toast.error(action.error.message);
      })
      .addCase(registerAsyncUser.pending, (state) => {
        state.status = "pending";
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
