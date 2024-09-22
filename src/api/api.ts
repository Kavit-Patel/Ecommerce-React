import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  IUserResponse,
  IUserDetails,
  IUserLoginDetails,
  IProductsResponse,
  ISingleProductResponse,
  IAddressFetchedResponse,
  IAddress,
  IAddAddressResponse,
  ICart,
  ICartResponseArr,
  ICartResponseSingle,
  INewOrderResponse,
  IOrder,
  IPaymentResponse,
  IFetchedOrdersResponse,
} from "../types/types";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});

const errorMessage = (err: unknown) => {
  if (err instanceof AxiosError && err.response) {
    const message = err.response.data?.message;
    return message instanceof Array
      ? err.response.data?.message.json(", ")
      : message || "Something went wrong !";
  }
  if (err instanceof Error) {
    return err.message || "Some error has occured !";
  }
  return "An unknown error occured !";
};

//USER APIs
export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserResponse, AxiosError, IUserDetails>(
    (data: IUserDetails) =>
      api.post("/api/addNewUser", data).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.setQueryData("user", data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<IUserResponse, AxiosError, IUserLoginDetails>(
    (data: IUserLoginDetails) =>
      api.post("/api/loginUser", data).then((res) => res.data),
    {
      onSuccess: (data) => {
        queryClient.setQueryData("user", data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};
export const useUserLogOut = () => {
  const queryClient = useQueryClient();
  return useQuery<IUserResponse, AxiosError>(
    ["userLogoutRes"],
    () => api.get("/api/logoutUser"),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: () => {
        queryClient.invalidateQueries("user");
        queryClient.setQueryData("user", undefined);
        queryClient.invalidateQueries("user");
      },
    }
  );
};

export const useProfile = () => {
  const queryClient = useQueryClient();
  return useQuery<IUserResponse, AxiosError>(
    ["profile"],
    () => api.get("/api/cookieAutoLogin").then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        queryClient.setQueryData("user", data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.info(errorMessage(err));
      },
    }
  );
};

//PRODUCT APIs
export const useFetchProducts = () => {
  const queryClient = useQueryClient();
  return useQuery<IProductsResponse, AxiosError>(
    ["fetchProducts"],
    () => api.get("/api/getAllProducts").then((res) => res.data),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        queryClient.setQueryData("products", data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};

export const useFetchSingleProduct = (id: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery<ISingleProductResponse, AxiosError>(
    ["productRes", id],
    () =>
      api.get(`/api/getSingleProduct/${id}`).then((res) => {
        const resp = res.data;
        return resp;
      }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        queryClient.setQueryData(["product", id], data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};

//CART APIs
export const useAddManyToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ICartResponseArr,
    AxiosError,
    { userId: string | undefined; items: ICart[] }
  >(
    ({ userId, items }) => {
      if (!userId) {
        throw new Error("User id is undefind, Login first !");
      }
      return api
        .post(`/api/syncCartWithLs/${userId}`, items)
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        queryClient.setQueryData(["cart", userId], data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};
export const useFetchUserCart = (
  userId: string | undefined,
  shouldFetch: boolean = false
) => {
  const queryClient = useQueryClient();
  return useQuery<ICartResponseArr, AxiosError>(
    ["cartRes", userId],
    () => {
      return api.get(`/api/getUserCart/${userId}`).then((res) => res.data);
    },
    {
      enabled: !!userId && shouldFetch,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data.response) {
          queryClient.setQueryData(["cart", userId], data.response);
        }
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};
export const useIncreaseQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ICartResponseSingle,
    AxiosError,
    { userId: string | undefined; cartId: string | undefined }
  >(
    ({ userId, cartId }) => {
      if (!userId || !cartId) {
        throw new Error("User id or cart id is missing !");
      }
      return api
        .get(`/api/increaseQuantity/${userId}/${cartId}`)
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        const cachedCart =
          queryClient.getQueryData<ICart[]>(["cart", userId]) || [];
        const updatedCart = cachedCart.map((cart) => {
          if (cart._id === data.response?._id) {
            return { ...cart, quantity: data.response?.quantity };
          }
          return cart;
        });
        queryClient.setQueryData(["cart", userId], updatedCart);
      },
    }
  );
};
export const useDecreaseQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ICartResponseSingle,
    AxiosError,
    { userId: string | undefined; cartId: string | undefined }
  >(
    ({ userId, cartId }) => {
      if (!userId || !cartId) {
        throw new Error("User id or cart id is missing !");
      }
      return api
        .get(`/api/decreaseQuantity/${userId}/${cartId}`)
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        const cachedCart =
          queryClient.getQueryData<ICart[]>(["cart", userId]) || [];
        const updatedCart = cachedCart.map((cart) => {
          if (cart._id === data.response?._id) {
            return { ...cart, quantity: data.response?.quantity };
          }
          return cart;
        });
        queryClient.setQueryData(["cart", userId], updatedCart);
      },
    }
  );
};
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ICartResponseSingle,
    AxiosError,
    { userId: string | undefined; cartId: string | undefined }
  >(
    ({ userId, cartId }) => {
      if (!userId || !cartId) {
        throw new Error("User id or cart id is missing !");
      }
      return api
        .get(`/api/removeItem/${userId}/${cartId}`)
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        const cachedCart =
          queryClient.getQueryData<ICart[]>(["cart", userId]) || [];
        const index = cachedCart.findIndex(
          (idx) => idx._id === data.response?._id
        );
        if (index !== -1) {
          cachedCart.splice(index);
        }
        queryClient.setQueryData(["cart", userId], cachedCart);
        queryClient.invalidateQueries(["cart", userId]);
        queryClient.setQueryData(["cart", userId], cachedCart);
      },
    }
  );
};

//ADDRESS APIs
export const useFetchUserAdress = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery<IAddressFetchedResponse, AxiosError>(
    ["addressRes", userId],
    () => api.get(`/api/fetchUserAddress/${userId}`).then((res) => res.data),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        queryClient.setQueryData<IAddress[] | undefined>(
          ["address", userId],
          data.response
        );
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};
export const useAddNewAddress = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAddAddressResponse,
    AxiosError,
    { userId: string | undefined; data: IAddress }
  >(
    ({ userId, data }) => {
      if (!userId) {
        throw new Error("userId is undefinded, Please Login first");
      }
      return api
        .post(`api/addNewAddress/${userId}`, data)
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        const existingUserAddress =
          queryClient.getQueryData<IAddress[]>(["address", userId]) || [];
        queryClient.setQueryData(
          ["address", userId],
          [...existingUserAddress, data.response]
        );
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};
export const useUpdateUserAddress = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAddAddressResponse,
    AxiosError,
    { userId: string | undefined; data: IAddress }
  >(
    ({ userId, data }) => {
      if (!userId) {
        throw new Error("User Id is undefind, Login first !");
      }
      return api
        .put(`/api/updateUserAddress/${userId}`, data)
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        const cachedAddresses =
          queryClient.getQueryData<IAddress[]>(["address", userId]) || [];
        const updatedAddresses = cachedAddresses.map((oldAddress) => {
          if (
            oldAddress.user === userId &&
            oldAddress._id === data.response?._id
          ) {
            return data.response;
          }
          return oldAddress;
        });
        queryClient.setQueryData(["address", userId], updatedAddresses);
      },
    }
  );
};
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAddAddressResponse,
    AxiosError,
    { userId: string | undefined; addressId: string }
  >(
    ({ userId, addressId }) => {
      if (!userId) {
        throw new Error("User Id is undefind, Login first !");
      }
      if (!addressId) {
        throw new Error("address Id is undefind / not provided !");
      }
      return api
        .delete(`api/deleteUserAddress/${userId}/${addressId}`)
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        const cachedAddresses =
          queryClient.getQueryData<IAddress[]>(["address", userId]) || [];
        const idxTobeDeleted = cachedAddresses.findIndex(
          (add) => add._id === data.response?._id
        );
        if (idxTobeDeleted !== -1) {
          cachedAddresses.splice(idxTobeDeleted);
        }
        queryClient.setQueryData(["address", userId], cachedAddresses);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};

//ORDER APIs
export const useNewOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<
    INewOrderResponse,
    AxiosError,
    {
      userId: string | undefined;
      cartIdArr: string[] | undefined;
      orderDetail: IOrder | undefined;
    }
  >(
    ({ userId, cartIdArr, orderDetail }) => {
      if (!userId) {
        throw new Error("User id is undefined, Login first !");
      }
      if (!cartIdArr) {
        throw new Error("provide cart items ids...");
      }
      if (!orderDetail) {
        throw new Error("provide order details");
      }
      return api
        .post(`/api/addNewOrder/${userId}`, { cartIdArr, ...orderDetail })
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        if (data.response) {
          queryClient.setQueryData(
            ["currentOrder", userId],
            data.response.newOrderWithProductsDetail
          );
        }
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};

export const useFetchUserOrders = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery<IFetchedOrdersResponse, AxiosError>(
    ["allOrdersRes", userId],
    () => api.get(`/api/getUserOrders/${userId}`).then((res) => res.data),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        queryClient.setQueryData(["allOrders", userId], data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};

//PAYMENT APIs
export const useCreatePaymentIntent = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IPaymentResponse,
    AxiosError,
    {
      userId: string | undefined;
      orderId: string | undefined;
      amount: number | undefined;
    }
  >(
    ({ userId, orderId, amount }) => {
      if (!userId) {
        throw new Error("User id is undefind ,Login first !");
      }
      if (!orderId) {
        throw new Error("ORder id is undefind !");
      }
      if (!amount) {
        throw new Error("Provide amount to generate payment intent !");
      }

      return api
        .post(`/api/createPaymentIntent/${userId}/${orderId}`, { amount })
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        queryClient.setQueryData(["paymentInit", userId], data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};
export const usePaymentSuccessed = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IPaymentResponse,
    AxiosError,
    {
      userId: string | undefined;
      paymentId: string | undefined;
      orderId: string | undefined;
      payMode: string | undefined;
    }
  >(
    ({ userId, paymentId, orderId, payMode }) => {
      if (!userId || !paymentId || !orderId || !payMode) {
        throw new Error(
          "Provide all details userId,paymentId,orderId and payMode"
        );
      }
      return api
        .post(`/api/paymentSuccessed/${userId}/${paymentId}`, {
          payMode,
          orderId,
        })
        .then((res) => res.data);
    },
    {
      onSuccess: (data, args) => {
        const { userId } = args;
        queryClient.setQueryData(["paymentSuccess", userId], data.response);
        toast.success(data.message);
      },
      onError: (err) => {
        toast.error(errorMessage(err));
      },
    }
  );
};
