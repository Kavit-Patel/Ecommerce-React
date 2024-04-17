import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store";
import { getUserOrders } from "../store/order/orderApi";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { setClientSecret } from "../store/payment/paymentSlice";
import { setComparedOrder } from "../store/order/orderSlice";
import { getCartFromDb } from "../store/cart/cartApi";
import { setCartItemLs } from "../store/cart/cartSlice";

const MyOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const order = useSelector((state: RootState) => state.order);
  const { paymentSuccedStatus } = useSelector(
    (state: RootState) => state.payment
  );
  useEffect(() => {
    if (user.user?._id) {
      dispatch(getUserOrders(user.user._id));
    }
  }, [dispatch, user.user?._id, paymentSuccedStatus]);
  //need to clear any payment intent-client secret and currentOrder-comparedOrder in MyOrder page, since if
  // any order is pending(payment is not done but order created) and if user do new shopping and then
  // generate new order that order neeeds to have new payment intent-client secret, otherwise perivious
  // finished order's data has been saved in clientSecret and currentOrder-comparedOrder which prevents
  // new clientSecret generation..
  useEffect(() => {
    dispatch(setClientSecret(undefined));
    dispatch(setComparedOrder(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (user.user?._id && paymentSuccedStatus === "success") {
      dispatch(getCartFromDb(user.user._id)); //after order generation db cart item state needs to be latest(empty)
      dispatch(setCartItemLs([])); // after order generation ls cart item state needs to be emptied
    }
  }, [dispatch, paymentSuccedStatus, user.user?._id]);

  return (
    <main className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5] flex justify-center items-center">
        <section className="w-full h-full py-5  flex justify-center items-center">
          <div className="w-full min-h-96 flex flex-col ">
            {order.allOrderFetchingStatus === "pending" ? (
              <Loader />
            ) : (
              <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                <div className="py-2 inline-block w-full  sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-white border-b">
                        <tr>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            Order-Id
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.allOrderFetchingStatus === "success" &&
                          order.allOrders.length > 0 &&
                          order.allOrders.map((orderItem, index) => (
                            <tr
                              key={orderItem._id}
                              className="bg-gray-100 border-b"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {orderItem._id}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {orderItem.payment?.paymentStatus}
                              </td>
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {orderItem.payment?.paymentStatus ===
                                "Pending" ? (
                                  <button
                                    onClick={() =>
                                      navigate("/order", {
                                        state: { orderId: orderItem._id },
                                      })
                                    }
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  " -- "
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {order.allOrderFetchingStatus === "success" &&
                      order.allOrders.length === 0 && (
                        <span className="w-full flex justify-center items-center mt-10">
                          No Order History !
                        </span>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MyOrders;
