import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

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

export const autoLoginWithCookie = createAsyncThunk(
  "user/auto-login",
  async (_, { rejectWithValue }) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/cookieAutoLogin`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "Application/Json",
          },
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
        error instanceof Error ? error.message : "User Login Failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
