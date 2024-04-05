import { useNavigate, useParams } from "react-router-dom";
import {
  addToCartLs,
  updateCartItem,
} from "../utilityFunctions/cartLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store";
import { useEffect, useRef, useState } from "react";
import { fetchProducts } from "../store/product/productSlice";
import Loader from "../components/Loader";
import { setCartItems } from "../store/cart/cartSlice";
import { getFullCartItems } from "../utilityFunctions/getFullCartItems";
import { getOrderSummary } from "../utilityFunctions/getOrderSummary";

function Cart() {
  const data = useSelector((state: RootState) => state.product);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const calledForId = useRef<string | null>(null);
  const [orderSummary, setOrderSummary] = useState<{
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (id && calledForId.current !== id) {
      addToCartLs(id);
      calledForId.current = id;
      navigate("/cart");
    }
  }, [id, navigate]);
  useEffect(() => {
    if (data.productsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, data.productsStatus]);
  useEffect(() => {
    dispatch(setCartItems(getFullCartItems(data.products)));
    const orderSummaryDetails = getOrderSummary(
      getFullCartItems(data.products)
    );
    setOrderSummary(orderSummaryDetails);
  }, [dispatch, data.products]);

  const itemLsOperation = (id: string, operation: string) => {
    updateCartItem(id, operation);
    dispatch(setCartItems(getFullCartItems(data.products)));
    const orderSummaryDetails = getOrderSummary(
      getFullCartItems(data.products)
    );
    setOrderSummary(orderSummaryDetails);
  };
  return (
    <main className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5]">
        {data.productsStatus === "error" && <div className="w-full h-96"></div>}
        {data.productsStatus === "success" ? (
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
                        {cartItems.map((item) => (
                          <div
                            key={item._id}
                            id="card"
                            className="w-full flex flex-col shadow-md lg:flex-row gap-3 lg:gap-6 justify-center items-center p-2"
                          >
                            <img
                              className="w-14"
                              src={item.image}
                              alt={item.name}
                            />
                            <div className="flex flex-col items-center lg:items-start gap-1">
                              <span className="title w-full lg:w-44 text-center lg:text-left text-xs">
                                {item.name}
                              </span>
                              <span className="id text-xs">{item.price}</span>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() =>
                                  itemLsOperation(item._id, "decrease")
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
                                  itemLsOperation(item._id, "increase")
                                }
                                className=" text-xl transition-all hover:font-bold hover:scale-125 active:scale-100"
                              >
                                +
                              </button>
                            </div>
                            <div className="price w-full text-center"></div>
                            <div
                              onClick={() =>
                                itemLsOperation(item._id, "remove")
                              }
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
                          {orderSummary ? orderSummary.subtotal : null}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Estimated Tax</span>
                        <span className="tax font-semibold">
                          {orderSummary ? orderSummary.tax : null}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Estimated shipping & Handling
                        </span>
                        <span className="shipping font-semibold">
                          {orderSummary ? orderSummary.shipping : null}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="total">
                          {orderSummary ? orderSummary.total : null}
                        </span>
                      </div>
                      <div className="w-[80%] h-10 rounded-sm self-center checkOut bg-black text-white flex justify-center items-center transition-all hover:scale-105 active:scale-100">
                        CheckOut
                      </div>
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
