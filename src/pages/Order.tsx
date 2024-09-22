import OrderSteps from "../components/OrderSteps";
import React, { useEffect, useState } from "react";
import { showAddress } from "../utilityFunctions/showAddress";
import { getOrderSummary } from "../utilityFunctions/getOrderSummary";
import { MdCurrencyRupee } from "react-icons/md";
import Loader from "../components/Loader";
import Payment from "../components/Payment";
import { useFetchUserCart } from "../api/api";
import { IAddress, ICart, IOrder, IPayment, IUser } from "../types/types";
import { useQueryClient } from "react-query";

const Order = () => {
  const queryClient = useQueryClient();
  const user: IUser | undefined = queryClient.getQueryData("user");
  const cachedPaymentInit: IPayment | undefined = queryClient.getQueryData([
    "paymentInit",
    user?._id,
  ]);
  const cachedCurrentOrder: IOrder | undefined = queryClient.getQueryData([
    "currentOrder",
    user?._id,
  ]);
  const selectedAddressFromCache: IAddress | undefined =
    queryClient.getQueryData(["selectedAddress", user?._id]);

  const { isError: isCartFetchingError, refetch: refetchCart } =
    useFetchUserCart(user?._id);
  const orderedCartProducts: ICart[] | undefined =
    user &&
    cachedCurrentOrder?.products.map((item) => ({
      user: user._id,
      product: item.product,
      quantity: item.quantity,
    }));
  const [cartItems, setCartItems] = useState<ICart[] | undefined>(
    orderedCartProducts
  );
  const [paymentIntent, setPaymentIntent] = useState<IPayment | null>(null);
  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } | null>(null);

  const [paymentMode, setPaymentMode] = useState<{
    creditCart: boolean;
    crypto: boolean;
  }>({ creditCart: true, crypto: false });

  useEffect(() => {
    if (user?._id && !cartItems) {
      refetchCart().then(
        (res) => res.data?.response && setCartItems(res.data.response)
      );
    }
  }, [refetchCart, user?._id, cartItems]);

  useEffect(() => {
    if (cachedPaymentInit && !paymentIntent) {
      setPaymentIntent(cachedPaymentInit);
    }
  }, [cachedPaymentInit, paymentIntent]);
  useEffect(() => {
    if (cartItems) {
      setOrderSummary(getOrderSummary(cartItems));
    }
  }, [cartItems]);
  return (
    <main className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5]">
        <section className="w-full  h-full py-5 px-8">
          <OrderSteps path={location.pathname} />
          <div className="w-full flex">
            <div className="h-full hidden md:block  flex-col w-[40%] border-2">
              <div className="h-full p-4 mt-5 flex flex-col gap-4">
                <div
                  id="cartContainer"
                  className=" overflow-y-auto max-h-96 flex flex-col gap-3"
                >
                  <h2 className="text-sm font-semibold mb-2">Summary</h2>
                  {!cartItems && <Loader />}
                  {isCartFetchingError && (
                    <div className="flex justify-center items-center">
                      {" "}
                      Error cartAddition / cartAdditionResponse{" "}
                    </div>
                  )}
                  {cartItems?.map((item) => (
                    <div
                      key={item.product._id}
                      id="card"
                      className="bg-[#f5f0f0] w-full flex shadow-md gap-3 items-center p-2 font-semibold"
                    >
                      <img
                        className="w-8"
                        src={item.product.image}
                        alt={item.product.name}
                      />

                      <span className="title w-full lg:w-44 text-center lg:text-left text-xs">
                        {item.product.name}
                      </span>
                      <span className="id text-xs ml-auto flex items-center">
                        <MdCurrencyRupee />
                        <span>{item.product.price * item.quantity}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className=" text-xs px-4 flex flex-col gap-2">
                <p>Address</p>
                <p className="pb-2">
                  {showAddress(selectedAddressFromCache)
                    ?.split("\n")
                    .map((line, index, arr) => (
                      <React.Fragment key={index}>
                        {line}
                        {arr.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                </p>
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span className="subtotal">
                    {orderSummary ? (
                      <span className="flex items-center">
                        <MdCurrencyRupee />
                        <span>{orderSummary.subtotal}</span>
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Estimated Tax</span>
                  <span className="tax font-semibold">
                    {orderSummary ? (
                      <span className="flex items-center">
                        <MdCurrencyRupee />
                        <span>{orderSummary.tax}</span>
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Estimated shipping & Handling
                  </span>
                  <span className="shipping font-semibold">
                    {orderSummary ? (
                      <span className="flex items-center">
                        <MdCurrencyRupee />
                        <span>{orderSummary.shipping}</span>
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="total">
                    {orderSummary ? (
                      <span className="flex items-center">
                        <MdCurrencyRupee />
                        <span>{orderSummary.total}</span>
                      </span>
                    ) : null}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 mt-5 flex flex-col gap-4">
              <h2 className="text-sm font-semibold">Payment</h2>
              <div className=" flex gap-4 text-xs">
                <span
                  onClick={() =>
                    setPaymentMode({ creditCart: true, crypto: false })
                  }
                  className={`${
                    paymentMode.creditCart
                      ? "font-semibold border-b border-black pb-1"
                      : ""
                  } cursor-pointer`}
                >
                  Credit Cart
                </span>
                <span
                  onClick={() =>
                    setPaymentMode({ creditCart: false, crypto: true })
                  }
                  className={`${
                    paymentMode.crypto
                      ? "font-semibold border-b border-black pb-1"
                      : ""
                  } cursor-pointer`}
                >
                  Crypto
                </span>
              </div>
              <div className={`${paymentMode.creditCart ? "block" : "hidden"}`}>
                {paymentIntent ? <Payment /> : <Loader />}
              </div>
              <div className={`${paymentMode.crypto ? "block" : "hidden"}`}>
                <div>This Method is under maintainance..</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Order;
