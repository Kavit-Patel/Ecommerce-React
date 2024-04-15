// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { loadStripe } from "@stripe/stripe-js";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// const stripePromise = loadStripe(`${import.meta.env.STRIPE_PUBLISH_KEY}`);

// export const createPaymentMethod = createAsyncThunk(
//   "payment/createPaymentMethod",
//   async ({ cardElement }: { cardElement: never }, { rejectWithValue }) => {
//     let stripe;
//     try {
//       stripe = await stripePromise;
//     } catch (error) {
//       return rejectWithValue(
//         error instanceof Error ? error.message : "Stripe is not Initialised !"
//       );
//     }
//     if (!stripe) {
//       return rejectWithValue("Stripe is not initialized");
//     }
//     if (!cardElement) {
//       return rejectWithValue("cardElement is not initialized properly");
//     }

//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: "card",
//       card: cardElement,
//     });

//     if (error) {
//       return rejectWithValue(error.message);
//     }

//     return paymentMethod;
//   }
// );

export const createPaymentIntent = createAsyncThunk(
  "paymentIntent/create",
  async (
    dataObject: {
      userId: string | undefined;
      orderId: string | undefined;
      amount: number | undefined;
    },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/createPaymentIntent/${
          dataObject.userId
        }/${dataObject.orderId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(dataObject.amount),
          }),
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
          : "Payment Intent Was not Created !";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getExistingPaymentIntent = createAsyncThunk(
  "paymentIntent/fetch",
  async (
    dataObject: {
      userId: string | undefined;
      orderId: string | undefined;
    },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/fetchOrderPaymentIntent/${
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
          : "Past PaymentIntent fetching failed !";
      return rejectWithValue(errorMessage);
    }
  }
);

export const paymentSuccessed = createAsyncThunk(
  "payment/succed",
  async (
    dataObject: {
      userId: string | undefined;
      paymentId: string | undefined;
      orderId: string | undefined;
      payMode: string | undefined;
    },
    { rejectWithValue }
  ) => {
    try {
      const request = await fetch(
        `${import.meta.env.VITE_API}/api/paymentSuccessed/${
          dataObject.userId
        }/${dataObject.paymentId}`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payMode: dataObject.payMode,
            orderId: dataObject.orderId,
          }),
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
        error instanceof Error ? error.message : "Payment Succed error !";
      return rejectWithValue(errorMessage);
    }
  }
);
