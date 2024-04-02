import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dataType } from "../../types/types";
import { toast } from "react-toastify";

export const fetchProducts = createAsyncThunk("product/fetch", async () => {
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
});

const initialState: dataType = {
  products: [],
  status: "idle",
};
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    init: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = "success";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        toast.error(action.error.message);
        state.status = "error";
      });
  },
});

export default productSlice.reducer;
export const { init } = productSlice.actions;
