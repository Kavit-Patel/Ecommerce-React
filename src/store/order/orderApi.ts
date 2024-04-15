import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderType } from "../../types/types";
import { toast } from "react-toastify";
import { removeLsCartItemAfterOrderCreated } from "../../utilityFunctions/removeLsCartItemAfterOrderCreated";

export const addNewOrder = createAsyncThunk(
  "order/add",
  async (
    dataObject: {
      userId: string | undefined;
      cartIdArr: string[] | undefined;
      orderDetail: orderType;
    },
    { rejectWithValue }
  ) => {
    const combineOrderDetailWithCartIdArr = {
      ...dataObject.orderDetail,
      cartIdArr: dataObject.cartIdArr,
    };
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/addNewOrder/${dataObject.userId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "Application/Json",
          },
          body: JSON.stringify(combineOrderDetailWithCartIdArr),
        }
      );
      const data = await request.json();
      if (data.success) {
        //order created so remove cart items from local storage
        removeLsCartItemAfterOrderCreated(data.response.removedCartArray);
        toast.success(data.message);
        return data.response.newOrderWithProductsDetail;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : " Order Creation Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/getUserOrders/${userId}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
        error instanceof Error
          ? error.message
          : "Fetching User Orders Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSingleUserOrder = createAsyncThunk(
  "order/fetchSingleUserOrder",
  async (
    dataObject: { userId: string | undefined; orderId: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/getSingleUserOrder/${
          dataObject.userId
        }/${dataObject.orderId}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
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
        error instanceof Error
          ? error.message
          : "Fetching User Orders Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserPendingOrder = createAsyncThunk(
  "order/fetchPendingOrder",
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/getUserPendingOrder/${userId}`,
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
        error instanceof Error
          ? error.message
          : "Fetching Pending Order Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);
