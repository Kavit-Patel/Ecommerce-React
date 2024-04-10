import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "product/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/getAllProducts`,
        { credentials: "include" }
      );
      const data = await request.json();
      if (data.success) {
        return data.response;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : " Product Fetch Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchSingleProduct = createAsyncThunk(
  "singleProduct/fetch",
  async (id: string) => {
    const request = await fetch(
      `${import.meta.env.VITE_API}/api/getSingleProduct/${id}`
    );
    const data = await request.json();
    if (data.success) {
      return data.response;
    } else {
      throw new Error(data.message);
    }
  }
);
