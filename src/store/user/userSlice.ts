import { createSlice } from "@reduxjs/toolkit";
import { LsCartTypeVanillaUser, userType } from "../../types/types";
import { toast } from "react-toastify";
import {
  autoLoginWithCookie,
  fetchAsyncUser,
  registerAsyncUser,
} from "./userApi";

interface initialStateType {
  user: userType | null;
  status: "idle" | "success" | "pending" | "error";
  vanillaUserCart: LsCartTypeVanillaUser[] | null;
  vanillaUserStatus: boolean;
}

const initialState: initialStateType = {
  user: null,
  status: "idle",
  vanillaUserCart: null,
  vanillaUserStatus: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setVanillaUser: (state, action) => {
      state.vanillaUserStatus = action.payload.status;
      state.vanillaUserCart = action.payload.data;
    },
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
      })
      .addCase(autoLoginWithCookie.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(autoLoginWithCookie.rejected, (state, action) => {
        state.status = "error";
        toast.error(action.error.message);
      })
      .addCase(autoLoginWithCookie.pending, (state) => {
        state.status = "pending";
      });
  },
});
export const { setVanillaUser, logout } = userSlice.actions;
export default userSlice.reducer;
