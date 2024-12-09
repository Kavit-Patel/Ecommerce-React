import Loader from "../components/Loader";
import { useEffect, useRef, useState } from "react";
import {
  getCartItems,
  updateCartItem,
} from "../utilityFunctions/localStorageCRUD";
import { MdCurrencyRupee } from "react-icons/md";
import { ICart, IPayment, IUser } from "../types/types";
import { useQueryClient } from "react-query";
import { getOrderSummary } from "../utilityFunctions/getOrderSummary";
import { Link, useLocation } from "react-router-dom";
import {
  useDecreaseQuantity,
  useFetchUserCart,
  useIncreaseQuantity,
  useRemoveCartItem,
} from "../api/api";

function Cart() {
  const queryClient = useQueryClient();
  const user: IUser | undefined = queryClient.getQueryData("user");
  const paymentInit: IPayment | undefined = queryClient.getQueryData([
    "paymentInit",
    user?._id,
  ]);
  const [cartModified] = useState<boolean>(false);
  const location = useLocation();
  const [lsCart] = useState<ICart[] | []>(() => getCartItems("ecommerceCart"));
  const [cachedCart] = useState<ICart[] | undefined>(() =>
    queryClient.getQueryData(["cart", user?._id])
  );
  const [cartItems, setCartItems] = useState<ICart[] | undefined>(undefined);

  const refInitCart = useRef<boolean>(false);

  const { refetch: refetchCart } = useFetchUserCart(user?._id);
  const { mutateAsync: incQuantMutate } = useIncreaseQuantity();
  const { mutateAsync: decQuantMutate } = useDecreaseQuantity();
  const { mutateAsync: removeCartItem, isLoading: isRemoveCartItemLoading } =
    useRemoveCartItem();

  useEffect(() => {
    if (!refInitCart.current) {
      refInitCart.current = true;
      setCartItems(() =>
        cachedCart ? [...lsCart, ...cachedCart] : [...lsCart]
      );
    }
  }, []);

  useEffect(() => {
    if (user && (!cachedCart || cachedCart.length === 0)) {
      refetchCart().then((res) => {
        const resp = res.data;
        resp?.response && setCartItems([...lsCart, ...resp.response]);
      });
    }
  }, [cachedCart, refetchCart]);
  useEffect(() => {
    if (location.pathname === "/checkout" || paymentInit?._id) {
      setCartItems([]);
    }
  }, [location.pathname, paymentInit?._id]);
  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } | null>(null);
  useEffect(() => {
    cartItems && setOrderSummary(getOrderSummary(cartItems));
  }, [cartModified, cartItems]);
  const itemLsOperation = async (cartItem: ICart, operation: string) => {
    const checkLocalExists = lsCart.find(
      (lsItem) =>
        lsItem.product._id === cartItem.product._id &&
        lsItem.user === cartItem.user
    );
    if (checkLocalExists) {
      const updatedLs = updateCartItem(cartItem, operation);
      setCartItems((prev) => {
        const latestDbCartItems = prev?.filter((item) => item._id);
        return cachedCart
          ? [...updatedLs, ...(latestDbCartItems || [])]
          : [...updatedLs];
      });
    }
    if (operation === "increase" && cartItem._id) {
      await incQuantMutate(
        {
          userId: cartItem.user,
          cartId: cartItem._id,
        },
        {
          onSuccess: (data) => {
            if (data.response) {
              const res = data.response;
              const updatedCart =
                cachedCart?.map((item) => {
                  if (item._id === res._id) {
                    return { ...item, quantity: res.quantity };
                  }
                  return item;
                }) || [];
              setCartItems((prev) => {
                const latestLsItems = prev?.filter((item) => !item._id);
                return [...(latestLsItems || []), ...updatedCart];
              });
            }
          },
        }
      );
    }

    if (operation === "decrease" && cartItem._id) {
      await decQuantMutate(
        {
          userId: cartItem.user,
          cartId: cartItem._id,
        },
        {
          onSuccess: (data) => {
            if (data.response) {
              const res = data.response;
              const updatedCart =
                cachedCart?.map((item) => {
                  if (item._id === res._id) {
                    return { ...item, quantity: res.quantity };
                  }
                  return item;
                }) || [];
              setCartItems((prev) => {
                const latestLsItems = prev?.filter((item) => !item._id);
                return [...(latestLsItems || []), ...updatedCart];
              });
            }
          },
        }
      );
    }
    if (operation === "remove" && cartItem._id) {
      await removeCartItem({
        userId: cartItem.user,
        cartId: cartItem._id,
      }).then((data) => {
        if (data.response) {
          setCartItems(() => {
            const latestLs = getCartItems("ecommerceCart");
            const latestDb: ICart[] | undefined = queryClient.getQueryData([
              "cart",
              user?._id,
            ]);
            return [...latestLs, ...(latestDb || [])];
          });
        }
      });
    }
  };
  return (
    <main className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5]">
        {cartItems ? (
          cartItems.length > 0 ? (
            <section className="w-full">
              <div className="path px-8 flex gap-3 py-4"></div>
              <div className="w-[375px] mx-auto border-2 lg:w-full lg:h-[656px] flex justify-center items-center">
                <div className="w-[95%] h-full flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-[596px] h-full p-4">
                    <h2 className="text-xl font-semibold mb-8 text-center lg:text-left">
                      Shopping Cart
                    </h2>
                    <div className="h-[560px] flex flex-col gap-4">
                      <div
                        id="cartContainer"
                        className="overflow-y-auto h-[80%] flex flex-col gap-3"
                      >
                        {cartItems?.map((item) => (
                          <div
                            key={item._id || item.product._id}
                            id="card"
                            className="w-full flex flex-col shadow-md lg:flex-row gap-3 lg:gap-6 justify-center items-center p-2"
                          >
                            <img
                              className="w-14"
                              src={
                                item.product?.image ||
                                "/d Iphone 14 pro 1-1.png"
                              }
                              alt={item.product.name}
                            />
                            <div className="flex flex-col items-center lg:items-start gap-1">
                              <span className="title w-full lg:w-44 text-center lg:text-left text-xs">
                                {item.product.name}
                              </span>
                              <span className="id text-xs">
                                <span className="flex items-center">
                                  <MdCurrencyRupee />
                                  <span>{item.product.price}</span>
                                </span>
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() =>
                                  itemLsOperation(item, "decrease")
                                }
                                className=" text-xl transition-all hover:font-bold hover:scale-125 active:scale-100"
                              >
                                -
                              </button>
                              <div className="quantity border-2 py-1 px-3 text-sm">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() =>
                                  itemLsOperation(item, "increase")
                                }
                                className=" text-xl transition-all hover:font-bold hover:scale-125 active:scale-100"
                              >
                                +
                              </button>
                            </div>
                            <div className="price w-full text-center"></div>
                            <div
                              onClick={() => {
                                {
                                  !isRemoveCartItemLoading &&
                                    itemLsOperation(item, "remove");
                                }
                              }}
                              className=" text-red-600 cursor-pointer rotate-45 text-xl transition-all hover:font-bold hover:scale-125 active:scale-100"
                            >
                              +
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-[536px] h-full p-4">
                    <h2 className="text-lg font-semibold my-5 text-center lg:text-left">
                      Order Summary
                    </h2>
                    <div className="lg:w-[80%] flex flex-col gap-6">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs" htmlFor="promocode">
                          Discount code / Promo code
                        </label>
                        <div className="w-full h-10 relative">
                          <input
                            name="promocode"
                            id="promocode"
                            className="w-full h-full border-2 outline-none"
                            type="text"
                          />
                          <button className="absolute right-5 top-2 text-xs border border-black px-3 py-1 rounded-md">
                            Apply
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs" htmlFor="cardnumber">
                          Your bonus card number
                        </label>
                        <div className="w-full h-10 relative">
                          <input
                            name="cardnumber"
                            id="cardnumber"
                            className="w-full h-full border-2 outline-none"
                            type="text"
                          />
                          <button className="absolute right-5 top-2 text-xs border border-black px-3 py-1 rounded-md">
                            Apply
                          </button>
                        </div>
                      </div>
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

                      <Link
                        to={"/checkout"}
                        className="w-[80%] h-10 rounded-sm self-center cursor-pointer bg-black text-white flex justify-center items-center transition-all hover:scale-105 active:scale-100"
                      >
                        CheckOut
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="w-full h-96 flex justify-center items-center">
              Your Cart is Empty !!
            </div>
          )
        ) : (
          <Loader />
        )}
      </div>
    </main>
  );
}

export default Cart;
