import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { paymentSuccessed } from "../store/payment/paymentApi";
// import { useState } from "react";

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISH_KEY}`);

const PaymentForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder } = useSelector((state: RootState) => state.order);
  const { paymentObject } = useSelector((state: RootState) => state.payment);
  const { user } = useSelector((state: RootState) => state.user);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();
  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    const { paymentIntent, error } = await stripe.confirmPayment({
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
    if (paymentIntent.status === "succeeded") {
      dispatch(
        paymentSuccessed({
          userId: user?._id,
          paymentId: paymentObject?._id,
          orderId: currentOrder?._id,
          payMode: "Credit Card",
        })
      );
      navigate("/myorders");
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
  const payment = useSelector((state: RootState) => state.payment);
  return (
    <>
      {(payment.createdStatus === "success" || payment.fetchedStatus) &&
      payment.clientSecret ? (
        <Elements
          options={{
            clientSecret: payment.clientSecret,
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
