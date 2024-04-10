import { createSlice } from "@reduxjs/toolkit";
import { dataType } from "../../types/types";
import { toast } from "react-toastify";
import { fetchProducts, fetchSingleProduct } from "./productApi";

const initialState: dataType = {
  products: [],
  productsStatus: "idle",
  product: null,
  productStatus: "idle",
  productsPriceRange: [1000000, 0],
};
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProductsPriceRange: (state) => {
      state.productsPriceRange = state.products
        .map((prod) => +prod.price.toFixed(0))
        .sort((a, b) => b - a);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsStatus = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.productsStatus = "success";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        toast.error(action.error.message);
        state.productsStatus = "error";
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.productStatus = "success";
      })
      .addCase(fetchSingleProduct.pending, (state) => {
        state.productStatus = "loading";
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        toast.error(action.error.message);
        state.productStatus = "error";
      });
  },
});

export default productSlice.reducer;
export const { getProductsPriceRange } = productSlice.actions;
