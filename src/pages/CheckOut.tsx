import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../store/Store";
import {
  addNewAddress,
  deleteUserAddress,
  fetchUserAddress,
  updateUserAddress,
} from "../store/address/addressApi";
import { showAddress } from "../utilityFunctions/showAddress";
import Loader from "../components/Loader";
import { MdDelete, MdEdit } from "react-icons/md";
import OrderSteps from "../components/OrderSteps";
import {
  calcCartItemDiffLsDs,
  calcCartItemQuantityDiffLsDs,
} from "../utilityFunctions/calcDiffLsDs";
import { setCartItemLs } from "../store/cart/cartSlice";
import { getFullCartItemsFromLs } from "../utilityFunctions/localStorageReduxOperation";
import {
  getCartFromDb,
  syncLsCartQuantityToDb,
  syncLsCartToDb,
} from "../store/cart/cartApi";
import { getCartItems } from "../utilityFunctions/localStorageCRUD";
import { getUserPendingOrder } from "../store/order/orderApi";
import { getOrderProducts } from "../utilityFunctions/getOrderProducts";
import { getComparedCurrentOrderWithPending } from "../utilityFunctions/getComparedCurrentOrderWithPending";
import { setComparedOrder } from "../store/order/orderSlice";
import { toast } from "react-toastify";
import { getExistingPaymentIntent } from "../store/payment/paymentApi";

const CheckOut = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, fetchedStatus } = useSelector(
    (state: RootState) => state.address
  );
  const user = useSelector((state: RootState) => state.user);
  const cart = useSelector((state: RootState) => state.cart);
  const data = useSelector((state: RootState) => state.product);
  const order = useSelector((state: RootState) => state.order);
  const payment = useSelector((state: RootState) => state.payment);
  const [resetCartItemDiffLsDs, setResetCartItemDiffLsDs] =
    useState<boolean>(false);
  const [resetCartItemQuantityDiffLsDs, setResetCartItemQuantityDiffLsDs] =
    useState<boolean>(false);
  const calledForCartSync = useRef<boolean>(false);
  const calledForCartQuantitySync = useRef<boolean>(false);
  const [radioCheck, setRadioCheck] = useState<string | undefined | null>(null);
  const [edit, setEdit] = useState<{ status: boolean; addressId: string }>({
    status: false,
    addressId: "",
  });
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [addressForm, setAddressForm] = useState<{
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  }>({ street: "", city: "", state: "", zipcode: "", country: "" });

  const [loader, setLoader] = useState<boolean>(false);

  const cartItemDiffLsDb = useMemo(() => {
    if (resetCartItemDiffLsDs || cart.statusDb === "idle") {
      return [];
    }
    if (cart.statusDb === "success" && cart.statusLs === "success") {
      return calcCartItemDiffLsDs(
        cart.cartItemsLs,
        cart.cartItemsDb,
        user.user?._id
      );
    } else {
      return [];
    }
  }, [
    cart.cartItemsDb,
    cart.cartItemsLs,
    resetCartItemDiffLsDs,
    cart.statusDb,
    cart.statusLs,
    user.user?._id,
  ]);

  const cartItemQuantityDiffLsDs = useMemo(() => {
    if (resetCartItemQuantityDiffLsDs || cart.statusDb === "idle") {
      return [];
    }
    if (cart.statusDb === "success") {
      return calcCartItemQuantityDiffLsDs(
        cart.cartItemsLs,
        cart.cartItemsDb,
        user.user?._id
      );
    } else {
      return [];
    }
  }, [
    cart.cartItemsDb,
    cart.cartItemsLs,
    cart.statusDb,
    resetCartItemQuantityDiffLsDs,
    user.user?._id,
  ]);

  useEffect(() => {
    if (user.status === "success") {
      dispatch(getCartFromDb(user.user?._id));
    }
  }, [dispatch, user.status, user.user?._id]);
  useEffect(() => {
    dispatch(
      setCartItemLs(
        getFullCartItemsFromLs(data.products, cart.cartItemsDb, user.user?._id)
      )
    );
  }, [
    dispatch,
    data.products,
    cart.cartItemsDb,
    cart.statusDb,
    user.user?._id,
  ]);

  useEffect(() => {
    if (
      (cart.statusItemSync === "success" &&
        cart.statusItemQuantitySync === "success") ||
      !(getCartItems().length > cart.cartItemsDb.length)
    ) {
      dispatch(setCartItemLs(cart.cartItemsDb));
    }
  }, [
    cart.cartItemsDb,
    cart.statusItemSync,
    cart.statusItemQuantitySync,
    dispatch,
  ]);
  useEffect(() => {
    if (
      user.status === "success" &&
      cartItemQuantityDiffLsDs.length > 0 &&
      !calledForCartQuantitySync.current
    ) {
      dispatch(
        syncLsCartQuantityToDb({
          userId: user.user?._id,
          cartArray: cartItemQuantityDiffLsDs,
        })
      );
      calledForCartQuantitySync.current = true;
      setResetCartItemQuantityDiffLsDs(true);
    }
  }, [cartItemQuantityDiffLsDs, dispatch, user.status, user.user?._id]);

  useEffect(() => {
    if (
      user.status === "success" &&
      cartItemDiffLsDb.length > 0 &&
      !calledForCartSync.current
    ) {
      dispatch(
        syncLsCartToDb({
          userId: user.user?._id,
          cartArray: cartItemDiffLsDb,
        })
      );
      calledForCartSync.current = true;
      setResetCartItemDiffLsDs(true);
    }
  }, [dispatch, user.status, user.user?._id, cartItemDiffLsDb]);

  const handleEdit = (addressId: string) => {
    setEdit({ status: true, addressId });
    setFormVisible(true);
    setAddressForm((prev) => {
      const matchAddress = addresses.find(
        (address) => address._id === addressId
      );
      if (matchAddress) {
        return {
          ...prev,
          street: matchAddress.street,
          city: matchAddress.city,
          state: matchAddress.state,
          zipcode: matchAddress.zipcode,
          country: matchAddress.country,
        };
      }
      return prev;
    });
  };

  const handleAddressDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    if (edit.status) {
      dispatch(
        updateUserAddress({
          userId: user.user?._id,
          addressDetails: { ...addressForm, _id: edit.addressId },
        })
      );
    } else {
      dispatch(
        addNewAddress({ userId: user.user?._id, addressDetail: addressForm })
      );
    }

    setLoader(false);
    setFormVisible(false);
    setEdit({ status: false, addressId: "" });
    setAddressForm({
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
    });
  };
  const handleDelete = (addressId: string | undefined) => {
    dispatch(deleteUserAddress({ userId: user.user?._id, addressId }));
  };
  useEffect(() => {
    dispatch(fetchUserAddress(user.user?._id));
  }, [dispatch, user.user?._id]);

  useEffect(() => {
    dispatch(getUserPendingOrder(user.user?._id));
  }, [dispatch, user.user?._id]);

  useEffect(() => {
    const CurrentOrderProducts = getOrderProducts(cart.cartItemsDb);
    const compareOrder = getComparedCurrentOrderWithPending(
      order.pendingOrders,
      CurrentOrderProducts
    );
    if (compareOrder) {
      toast.info(
        "This order is already generated ! select address to Proceed to Payment !"
      );
    }
    dispatch(setComparedOrder(compareOrder));
  }, [dispatch, cart.cartItemsDb, order.pendingOrders]);

  // if comparedOrder is not null and comparedOrderStatus is compared means currently order to be placed is already
  //generated and assigned to comparedOrder now if clientSecret is null i can call dispatch for generating client secret
  //using comparedOrder or currentOrder(since setComparedOrder's logic write like that) and so client secret will no longer be null this dispatch will not called again
  useEffect(() => {
    if (
      user.user?._id &&
      order.comparedOrder &&
      order.comparedOrderStatus === "compared" &&
      !payment.clientSecret
    ) {
      dispatch(
        getExistingPaymentIntent({
          userId: user.user._id,
          orderId: order.comparedOrder._id,
        })
      );
    }
  }, [
    dispatch,
    order.comparedOrder,
    order.comparedOrderStatus,
    payment.clientSecret,
    user.user?._id,
  ]);
  return (
    <div className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5] flex justify-center items-center">
        <section className="w-full h-full py-5 px-8 relative">
          <OrderSteps path={location.pathname} />
          <div
            className={`w-full h-full mt-12 ${
              formVisible ? " filter blur-3xl" : ""
            }`}
          >
            <h2 className="text-sm my-4">Select Address</h2>
            <div className="w-[95%] flex flex-col  gap-2 min-h-[33rem] md:min-h-[15rem] max-h-[25rem] overflow-y-auto">
              {user.status !== "success" && (
                <div className="flex justify-center items-center p-5">
                  Login first !
                </div>
              )}
              {fetchedStatus === "pending" && <Loader />}
              {user.status === "success" &&
                fetchedStatus === "success" &&
                addresses?.map((address) => (
                  <div
                    key={address._id}
                    className="w-full p-4 bg-[#f5f0f0] flex gap-6"
                  >
                    <input
                      type="radio"
                      name="addressSelect"
                      id={address._id}
                      onChange={() => setRadioCheck(address._id)}
                      checked={radioCheck === address._id}
                    />

                    <label
                      className="w-[80%] h-full overflow-y-auto content-center"
                      htmlFor={address._id}
                    >
                      {showAddress(address)
                        .split("\n")
                        .map((line, index, arr) => (
                          <React.Fragment key={index}>
                            {line}
                            {index < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                    </label>

                    <button
                      disabled={radioCheck === address._id ? false : true}
                      onClick={() => {
                        if (address._id) {
                          handleEdit(address._id);
                        }
                      }}
                    >
                      <MdEdit />
                    </button>
                    <button
                      disabled={radioCheck === address._id ? false : true}
                      onClick={() => {
                        if (address._id) {
                          handleDelete(address._id);
                        }
                      }}
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))}
              {user.status === "success" && addresses.length === 0 && (
                <div className="flex justify-center items-center p-5">
                  No Address Saved !
                </div>
              )}
            </div>
            <div className="w-full flex items-center justify-center py-4">
              <div className="w-[25%] h-0.5 bg-slate-300"></div>
              <div className=" relative ">
                <button
                  disabled={user.user?._id ? false : true}
                  onClick={() => setFormVisible(true)}
                  className={`w-4 h-4 cursor-pointer transition-all ${
                    user.user?._id ? "active:scale-90" : ""
                  } bg-black flex justify-center items-center pb-1 rounded-full text-white mx-2`}
                >
                  +
                </button>
                <p className="text-center absolute top-5 -right-8 w-24 text-xs">
                  Add New Address
                </p>
              </div>
              <div className="w-[25%] h-0.5 bg-slate-300"></div>
            </div>
            <div className="w-[35%] flex justify-around gap-2 ml-auto mt-10">
              <Link
                className="w-1/2 px-3 h-10 bg-gray-100 border border-black rounded-sm flex justify-center items-center transition-all hover:scale-105 active:scale-100"
                to="/cart"
              >
                Back
              </Link>
              <Link
                className="addToCart w-1/2  px-3 h-10 bg-black rounded-sm text-white flex justify-center items-center transition-all hover:scale-105 active:scale-100"
                to={radioCheck ? `/order/${radioCheck}` : "/checkout"}
              >
                Next
              </Link>
            </div>
          </div>

          {formVisible && (
            <div className="flex justify-center">
              <form
                onSubmit={(e) => handleSubmit(e)}
                action=""
                className=" w-[70%]  bg-[#f6f6f6] absolute top-20  border-2 p-6  flex flex-col gap-2 shadow-xl rounded-xl"
              >
                <div className="text-center mb-4 text-xl font-semibold border-b border-black w-fit pb-1 self-center">
                  Create New Address
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-8 justify-between">
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="street">Street</label>
                    <input
                      value={addressForm.street}
                      onChange={(e) => handleAddressDetail(e)}
                      className="p-2 rounded-md outline-none border border-[#EEEEF4]"
                      name="street"
                      type="text"
                      placeholder="2118 Thomridge"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="city">City</label>
                    <input
                      value={addressForm.city}
                      onChange={(e) => handleAddressDetail(e)}
                      className="p-2 rounded-md outline-none border border-[#EEEEF4]"
                      name="city"
                      type="text"
                      placeholder="Syracuse"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-8 justify-between">
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="state">State</label>
                    <input
                      value={addressForm.state}
                      onChange={(e) => handleAddressDetail(e)}
                      className="p-2 rounded-md outline-none border border-[#EEEEF4]"
                      name="state"
                      type="text"
                      placeholder="Connecticut"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="zipcode">Zipcode</label>
                    <input
                      value={addressForm.zipcode}
                      onChange={(e) => handleAddressDetail(e)}
                      className="p-2 rounded-md outline-none border border-[#EEEEF4]"
                      name="zipcode"
                      type="text"
                      placeholder="35624"
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col gap-1">
                  <label htmlFor="country">Country</label>
                  <input
                    value={addressForm.country}
                    onChange={(e) => handleAddressDetail(e)}
                    className="p-2 rounded-md outline-none border border-[#EEEEF4]"
                    name="country"
                    type="text"
                    placeholder="United States of America "
                  />
                </div>

                <button
                  type="submit"
                  className={`bg-[#D8DDE2] transition-all  ${
                    loader ? "animate-pulse" : ""
                  } active:scale-95 hover:bg-[#B6BCC2] hover:font-semibold cursor-pointer p-2.5 rounded-md`}
                >
                  {loader ? (
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
                  ) : edit.status ? (
                    "Update Address"
                  ) : (
                    "Create New Address"
                  )}
                </button>
                <p
                  onClick={() => {
                    setFormVisible(false);
                    setEdit({ status: false, addressId: "" });
                    setAddressForm({
                      street: "",
                      city: "",
                      state: "",
                      zipcode: "",
                      country: "",
                    });
                  }}
                  className="bg-[#e8e8e8] text-center transition-all active:scale-95 hover:bg-[#B6BCC2] hover:font-semibold cursor-pointer p-2.5 rounded-md"
                >
                  Cancel
                </p>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CheckOut;
