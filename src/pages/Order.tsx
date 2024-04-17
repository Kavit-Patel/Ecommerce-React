import { useLocation, useNavigate, useParams } from "react-router-dom";
import OrderSteps from "../components/OrderSteps";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store";

import React, { useEffect, useMemo, useState } from "react";

import { showAddress } from "../utilityFunctions/showAddress";
import { getOrderSummary } from "../utilityFunctions/getOrderSummary";
import { MdCurrencyRupee } from "react-icons/md";
import { addNewOrder, getSingleUserOrder } from "../store/order/orderApi";
import { getOrderProducts } from "../utilityFunctions/getOrderProducts";
import { getOrderCartIdArr } from "../utilityFunctions/getOrderCartIdArr";
import Loader from "../components/Loader";
import Payment from "../components/Payment";
import {
  createPaymentIntent,
  getExistingPaymentIntent,
} from "../store/payment/paymentApi";
import { fetchUserAddress } from "../store/address/addressApi";
import { setCartItemLs } from "../store/cart/cartSlice";
import { getCartFromDb } from "../store/cart/cartApi";
import { setVanillaUser } from "../store/user/userSlice";

const Order = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addressId } = params;
  const dispatch = useDispatch<AppDispatch>();
  const { addresses } = useSelector((state: RootState) => state.address);
  const data = useSelector((state: RootState) => state.product);
  const cart = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user);
  const order = useSelector((state: RootState) => state.order);
  const payment = useSelector((state: RootState) => state.payment);
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

  const address = useMemo(() => {
    const myAddress = addresses.find((add) => add._id === addressId);
    if (myAddress) {
      return showAddress(myAddress);
    }
    if (!addressId && order.currentOrder && order.currentOrder.address) {
      const myAddress = addresses.find(
        (add) => add._id === order.currentOrder?.address
      );
      return showAddress(myAddress);
    }
    return "no address";
  }, [addressId, addresses, order.currentOrder]);

  useEffect(() => {
    const orderProducts = getOrderProducts(cart.cartItemsDb);
    if (
      orderProducts &&
      orderProducts.length > 0 &&
      user.user?._id &&
      addressId &&
      orderSummary &&
      order.fetchedPendingOrderStatus === "success" &&
      order.comparedOrderStatus === "compared"
    ) {
      if (!order.comparedOrder) {
        dispatch(
          addNewOrder({
            userId: user.user._id,
            cartIdArr: getOrderCartIdArr(cart.cartItemsDb),
            orderDetail: {
              products: orderProducts,
              address: addressId,
              ...orderSummary,
            },
          })
        );
      }
      navigate("/order");
    }
  }, [
    addressId,
    dispatch,
    data.products,
    user.user?._id,
    orderSummary,
    navigate,
    cart.cartItemsDb,
    order.comparedOrder,
    order.comparedOrderStatus,
    order.fetchedPendingOrderStatus,
  ]);
  useEffect(() => {
    if (user.user?._id && order.createdStatus === "success") {
      dispatch(getCartFromDb(user.user._id)); //after order generation db cart item state needs to be latest(empty)
      dispatch(setCartItemLs([])); // after order generation ls cart item state needs to be emptied
      dispatch(setVanillaUser({ status: false, data: null })); //after order generation vanilla user status needs to be false as well as vanilla user cart needs to be emptied
    }
  }, [dispatch, order.createdStatus, user.user?._id]);

  useEffect(() => {
    setOrderSummary(getOrderSummary(cart.cartItemsDb));
  }, [cart.cartItemsDb]);
  useEffect(() => {
    if (
      !payment.clientSecret &&
      order.comparedOrderStatus === "compared" &&
      order.createdStatus === "success" &&
      order.currentOrder &&
      order.currentOrder._id &&
      order.currentOrder.total &&
      payment.fetchedStatus !== "success"
    ) {
      dispatch(
        createPaymentIntent({
          userId: user.user?._id,
          orderId: order.currentOrder._id,
          amount: Number(order.currentOrder.total),
        })
      );
    }
  }, [
    order.comparedOrderStatus,
    order.createdStatus,
    order.currentOrder,
    dispatch,
    payment.clientSecret,
    user.user?._id,
    payment.fetchedStatus,
  ]);
  useEffect(() => {
    if (location.state?.orderId) {
      dispatch(
        getExistingPaymentIntent({
          userId: user.user?._id,
          orderId: location.state.orderId,
        })
      );
      dispatch(
        getSingleUserOrder({
          userId: user.user?._id,
          orderId: location.state.orderId,
        })
      );
      dispatch(fetchUserAddress(user.user?._id));
    }
  }, [dispatch, location.state?.orderId, user.user?._id]);
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
                  {order.createdStatus === "pending" && <Loader />}
                  {order.currentOrder?.products.map((item) => (
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
                <p>
                  {address.split("\n").map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span className="subtotal">
                    {order.currentOrder ? (
                      <span className="flex items-center">
                        <MdCurrencyRupee />
                        <span>{order.currentOrder.subtotal}</span>
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Estimated Tax</span>
                  <span className="tax font-semibold">
                    {order.currentOrder ? (
                      <span className="flex items-center">
                        <MdCurrencyRupee />
                        <span>{order.currentOrder.tax}</span>
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">
                    Estimated shipping & Handling
                  </span>
                  <span className="shipping font-semibold">
                    {order.currentOrder ? (
                      <span className="flex items-center">
                        <MdCurrencyRupee />
                        <span>{order.currentOrder.shipping}</span>
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="total">
                    {order.currentOrder ? (
                      <span className="flex items-center">
                        <MdCurrencyRupee />
                        <span>{order.currentOrder.total}</span>
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
                {payment.clientSecret ? <Payment /> : <Loader />}
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
