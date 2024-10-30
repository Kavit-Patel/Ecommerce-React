import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showAddress } from "../utilityFunctions/showAddress";
import Loader from "../components/Loader";
import { MdDelete, MdEdit } from "react-icons/md";
import OrderSteps from "../components/OrderSteps";
import { getCartItems } from "../utilityFunctions/localStorageCRUD";
import { toast } from "react-toastify";
import {
  useAddManyToCart,
  useAddNewAddress,
  useCreatePaymentIntent,
  useDeleteAddress,
  useFetchUserAdress,
  useFetchUserCart,
  useNewOrder,
  useUpdateUserAddress,
} from "../api/api";
import { IAddress, ICart, IOrder, IPayment, IUser } from "../types/types";
import { useQueryClient } from "react-query";
import { getOrderSummary } from "../utilityFunctions/getOrderSummary";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const lsCart: ICart[] = getCartItems("ecommerceCart");
  const user: IUser | undefined = queryClient.getQueryData("user");
  const cachedAddress: IAddress[] | undefined = queryClient.getQueryData([
    "address",
    user?._id,
  ]);
  const { isLoading: isAddressLoading, refetch } = useFetchUserAdress(
    user?._id
  );
  const [addresses, setAddresses] = useState<IAddress[] | []>(
    cachedAddress || []
  );
  const [selectedAdd, setSelectedAdd] = useState<IAddress | null>(null);
  const { mutateAsync: addToCart } = useAddManyToCart();

  const { mutateAsync: addAddress, isLoading: isAddressAddingLoading } =
    useAddNewAddress();
  const { mutateAsync: updateAddress, isLoading: isAddressUpdateLoading } =
    useUpdateUserAddress();
  const { mutateAsync: deleteAddress, isLoading: isAddressDeleteLoading } =
    useDeleteAddress();
  const { refetch: refetchUserCart } = useFetchUserCart(user?._id);
  const { mutateAsync: createNewOrder, isLoading: isOrderGenerationLoading } =
    useNewOrder();
  const {
    mutateAsync: createPaymentIntent,
    isLoading: isPaymentCreationLoading,
  } = useCreatePaymentIntent();

  const [cartItems, setCartItems] = useState<ICart[] | undefined>(undefined);
  const cartAdditionDone = useRef<boolean>(false);
  const orderGenerationDone = useRef<boolean>(false);
  const paymentIntentGenerationDone = useRef<boolean>(false);
  const [radioCheck, setRadioCheck] = useState<string | undefined | null>(null);
  const [edit, setEdit] = useState<{ status: boolean; addressId: string }>({
    status: false,
    addressId: "",
  });
  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } | null>(null);
  const [currentOrder, setCurrentOrder] = useState<IOrder | undefined>(
    undefined
  );
  const [paymentInit, setPaymentInit] = useState<IPayment | undefined>(
    undefined
  );
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [addressForm, setAddressForm] = useState<{
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  }>({ street: "", city: "", state: "", zipcode: "", country: "" });

  useEffect(() => {
    (async () => {
      if (lsCart.length > 0) {
        await addToCart(
          { userId: user?._id, items: lsCart },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(["cart", user?._id]);
              localStorage.setItem("ecommerceCart", "[]");
            },
          }
        );
      }
    })().then(async () => {
      await refetchUserCart().then((data) => setCartItems(data.data?.response));
    });
    // }
  }, [addToCart, lsCart.length, user?._id]);
  useEffect(() => {
    if (cartItems) {
      setOrderSummary(getOrderSummary(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (
      !orderGenerationDone.current &&
      cartItems &&
      orderSummary &&
      selectedAdd
    ) {
      const cartIdArr: string[] | undefined = cartItems.map(
        (item) => item._id || ""
      );
      const productsTobeOrdered = cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price * item.quantity,
      }));
      const orderDetail: IOrder = {
        products: productsTobeOrdered,
        address: selectedAdd,
        ...orderSummary,
      };
      (async () =>
        await createNewOrder({
          userId: user?._id,
          cartIdArr,
          orderDetail,
        }))().then(
        (data) =>
          data.response &&
          setCurrentOrder(data.response.newOrderWithProductsDetail)
      );
      orderGenerationDone.current = true;
    }
  }, [
    cartAdditionDone,
    cartItems,
    orderSummary,
    selectedAdd,
    user?._id,
    createNewOrder,
  ]);

  useEffect(() => {
    if (
      orderGenerationDone.current &&
      currentOrder &&
      !paymentIntentGenerationDone.current
    ) {
      (async () =>
        createPaymentIntent({
          userId: user?._id,
          orderId: currentOrder._id,
          amount: currentOrder.total,
        }))().then((data) => setPaymentInit(data.response));
      paymentIntentGenerationDone.current = true;
    }
  }, [
    createPaymentIntent,
    user?._id,
    orderGenerationDone,
    paymentIntentGenerationDone,
    currentOrder,
  ]);

  useEffect(() => {
    if (!cachedAddress && addresses.length === 0 && user?._id) {
      refetch().then(
        (res) => res.data?.response && setAddresses(res.data?.response)
      );
    }
  }, [addresses.length, refetch, user?._id]);

  const handleEdit = (addressId: string) => {
    setEdit({ status: true, addressId });
    setFormVisible(true);
    setAddressForm((prev) => {
      const matchAddress = addresses?.find(
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (edit.status) {
      await updateAddress(
        { userId: user?._id, data: { ...addressForm, _id: edit.addressId } },
        {
          onSuccess: (data) => {
            if (data.response) {
              const res = data.response;
              setAddresses((prev) => {
                return prev.map((oldAdd) => {
                  if (oldAdd._id === res._id) {
                    return res;
                  }
                  return oldAdd;
                });
              });
            }
          },
        }
      );
    } else {
      await addAddress(
        { userId: user?._id, data: addressForm },
        {
          onSuccess: (data) => {
            if (data.response) {
              const newAddress = [data.response];
              setAddresses((prev) => [...prev, ...newAddress]);
            }
          },
        }
      );
    }

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
  const handleDelete = async (addressId: string) => {
    await deleteAddress(
      { userId: user?._id, addressId },
      {
        onSuccess: (data) => {
          if (data.response) {
            const res = data.response;
            setAddresses((prev) => {
              const idxToBeDeleted = prev.findIndex(
                (add) => add._id === res._id
              );
              if (idxToBeDeleted !== -1) {
                prev.splice(idxToBeDeleted);
              }
              return prev;
            });
          }
        },
      }
    );
  };
  useEffect(() => {
    if (radioCheck) {
      const currentAddress = addresses.find((add) => add._id === radioCheck);
      currentAddress && setSelectedAdd(currentAddress);
    }
  }, [radioCheck, addresses]);
  const handleNext = (checkedAddress: string) => {
    const selectedAddressExists = addresses.find(
      (add) => add._id === checkedAddress
    );
    if (!selectedAddressExists) {
      toast.info("Please Select address properly !");
    }
    queryClient.setQueryData(
      ["selectedAddress", user?._id],
      selectedAddressExists
    );
    queryClient.invalidateQueries(["selectedAddress", user?._id]);
    if (!paymentInit) {
      toast.info("Payment Intent is not present !");
    }
    paymentInit && navigate("/order");
  };
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
              {!user && (
                <div className="flex justify-center items-center p-5">
                  Login first !
                </div>
              )}
              {isAddressLoading && <Loader />}
              {user &&
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
              {user && addresses?.length === 0 && (
                <div className="flex justify-center items-center p-5">
                  No Address Saved !
                </div>
              )}
            </div>
            <div className="w-full flex items-center justify-center py-4">
              <div className="w-[25%] h-0.5 bg-slate-300"></div>
              <div className=" relative ">
                <button
                  disabled={user?._id ? false : true}
                  onClick={() => setFormVisible(true)}
                  className={`w-4 h-4 cursor-pointer transition-all ${
                    user?._id ? "active:scale-90" : ""
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
              <div
                className={`addToCart w-1/2  px-3 h-10 rounded-sm text-white flex justify-center items-center ${
                  isPaymentCreationLoading ||
                  isOrderGenerationLoading ||
                  !radioCheck
                    ? "bg-gray-400 cursor-wait"
                    : " cursor-pointer bg-black transition-all hover:scale-105 active:scale-100 "
                }`}
                onClick={() => radioCheck && handleNext(radioCheck)}
              >
                Next
              </div>
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
                    isAddressUpdateLoading ||
                    isAddressDeleteLoading ||
                    isAddressAddingLoading
                      ? "animate-pulse"
                      : ""
                  } active:scale-95 hover:bg-[#B6BCC2] hover:font-semibold cursor-pointer p-2.5 rounded-md`}
                >
                  {isAddressUpdateLoading ||
                  isAddressDeleteLoading ||
                  isAddressAddingLoading ? (
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
