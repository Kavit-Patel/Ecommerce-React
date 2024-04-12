import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { addressType } from "../../types/types";

export const addNewAddress = createAsyncThunk(
  "address/add",
  async (
    dataObject: {
      userId: string | undefined;
      addressDetail: addressType;
    },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/addNewAddress/${dataObject.userId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "Application/Json",
          },
          body: JSON.stringify(dataObject.addressDetail),
        }
      );
      const data = await request.json();
      if (data.success) {
        toast.success("Addresses Created Successfully !");
        return data.response;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Address Creation Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchUserAddress = createAsyncThunk(
  "address/fetch",
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/fetchUserAddress/${userId}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "Application/Json",
          },
        }
      );
      const data = await request.json();
      if (data.success) {
        toast.success("Addresses Fetched Successfully !");
        return data.response;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Address Fetching Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  "address/update",
  async (
    dataObject: {
      userId: string | undefined;
      addressDetails: addressType;
    },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/updateUserAddress/${
          dataObject.userId
        }`,
        {
          credentials: "include",
          method: "PUT",
          headers: {
            "Content-Type": "Application/Json",
          },
          body: JSON.stringify(dataObject.addressDetails),
        }
      );
      const data = await request.json();
      if (data.success) {
        toast.success("Addresses Updated Successfully !");
        return data.response;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Address Updation Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  "address/delete",
  async (
    dataObject: { userId: string | undefined; addressId: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/deleteUserAddress/${
          dataObject.userId
        }/${dataObject.addressId}`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-Type": "Application/Json",
          },
        }
      );
      const data = await request.json();
      if (data.success) {
        toast.success("Addresses Deleted Successfully !");
        return data.response;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Address Deletion Failed !";
      return rejectWithValue(errorMessage);
    }
  }
);
