import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useQueryClient } from "react-query";
import { IOrder, IUser } from "../types/types";
import { useFetchUserOrders } from "../api/api";

const MyOrders = () => {
  const queryClient = useQueryClient();
  const cachedUser: IUser | undefined = queryClient.getQueryData("user");
  const { refetch: refetchUserOrders, isLoading } = useFetchUserOrders(
    cachedUser?._id
  );
  const [userOrders, setUserOrders] = useState<IOrder[] | undefined>(undefined);
  useEffect(() => {
    if (cachedUser?._id && !userOrders) {
      refetchUserOrders().then((data) => setUserOrders(data.data?.response));
    }
  }, [cachedUser, refetchUserOrders, userOrders]);
  return (
    <main className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5] flex justify-center items-center">
        <section className="w-full h-full py-5  flex justify-center items-center">
          <div className="w-full min-h-96 flex flex-col ">
            {isLoading ? (
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
                            Date
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
                            Paid
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders &&
                          userOrders.length > 0 &&
                          userOrders.reverse().map(
                            (orderItem, index) =>
                              orderItem.payment?.paymentStatus === "Done" && (
                                <tr
                                  key={orderItem._id}
                                  className="bg-gray-100 border-b"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {index + 1}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {orderItem._id}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {orderItem.createdAt?.split("T")[0]}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {orderItem.payment?.paymentStatus}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {orderItem.total}
                                  </td>
                                </tr>
                              )
                          )}
                      </tbody>
                    </table>
                    {userOrders?.length === 0 && (
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
