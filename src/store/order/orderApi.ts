import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderType } from "../../types/types";
import { toast } from "react-toastify";

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
        toast.success(data.message);
        return data.response;
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
