import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { IOrder, IPayment, IUser } from "../types/types";
import { useQueryClient } from "react-query";
import { usePaymentSuccessed } from "../api/api";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISH_KEY}`);

const PaymentForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cachedUser: IUser | undefined = queryClient.getQueryData("user");
  const cachedCurrentOrder: IOrder | undefined = queryClient.getQueryData([
    "currentOrder",
    cachedUser?._id,
  ]);
  const cachedPaymentInit: IPayment | undefined = queryClient.getQueryData([
    "paymentInit",
    cachedUser?._id,
  ]);

  const { mutateAsync: mutatePaymentSuccessed } = usePaymentSuccessed();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();
  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });
    if (error) {
      setIsProcessing(false);
      return toast.error(
        error.message || "Something went wrong in payment component"
      );
    }
    if (cachedPaymentInit) {
      await mutatePaymentSuccessed({
        userId: cachedUser?._id,
        paymentId: cachedPaymentInit?._id,
        orderId: cachedCurrentOrder?._id,
        payMode: "Credit Card",
      }).then(() => {
        queryClient.removeQueries(["cart", cachedUser?._id]);
        queryClient.removeQueries(["address", cachedUser?._id]);
        queryClient.removeQueries(["cart", cachedUser?._id]);
        queryClient.removeQueries(["product", cachedUser?._id]);
        queryClient.removeQueries(["address", cachedUser?._id]);
        queryClient.removeQueries(["currentOrder", cachedUser?._id]);
        queryClient.removeQueries(["paymentInit", cachedUser?._id]);
        queryClient.removeQueries(["paymentSuccess", cachedUser?._id]);
        navigate("/myorders");
      });
    }
    setIsProcessing(false);
  };
  return (
    <div className="w-full">
      <form onSubmit={(e) => handlePayment(e)}>
        <PaymentElement />
        <button
          className={`w-full mt-2 bg-[#D8DDE2] transition-all 
                  ${
                    isProcessing ? "animate-pulse" : ""
                  } active:scale-95 hover:bg-[#B6BCC2] hover:font-semibold cursor-pointer
                  
               p-2.5 rounded-md`}
          type="submit"
        >
          {isProcessing ? (
            <div className="flex items-end justify-center gap-1 py-2">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          ) : (
            <div className="">Pay</div>
          )}
        </button>
      </form>
    </div>
  );
};

const Payment = () => {
  const queryClient = useQueryClient();
  const cachedUser: IUser | undefined = queryClient.getQueryData("user");
  const cachedPaymentInit: IPayment | undefined = queryClient.getQueryData([
    "paymentInit",
    cachedUser?._id,
  ]);
  return (
    <>
      {cachedPaymentInit && cachedPaymentInit.paymentIntent ? (
        <Elements
          options={{
            clientSecret: cachedPaymentInit.paymentIntent,
          }}
          stripe={stripePromise}
        >
          <PaymentForm />
        </Elements>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default Payment;
