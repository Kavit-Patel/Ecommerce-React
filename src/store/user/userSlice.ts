import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userType } from "../../types/types";
import { toast } from "react-toastify";

interface initialStateType {
  user: userType | null;
  status: "idle" | "success" | "pending" | "error";
}

const initialState: initialStateType = {
  user: null,
  status: "idle",
};

export const registerAsyncUser = createAsyncThunk(
  "user/register",
  async (
    userDetails: {
      name: string;
      surname: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/addNewUser`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "Application/Json",
          },
          body: JSON.stringify(userDetails),
        }
      );

      const data = await request.json();
      if (data.success) {
        toast.success(data.message);
        return data.response;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "User Registration fail";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAsyncUser = createAsyncThunk(
  "user/fetch",
  async (
    userLoginDetails: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(`${import.meta.env.VITE_API}/api/loginUser`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "Application/Json",
        },
        body: JSON.stringify(userLoginDetails),
      });
      const data = await request.json();
      if (data.success) {
        toast.success(data.message);
        return data.response;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "User Login Failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
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

export default userSlice.reducer;
