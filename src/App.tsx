import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";

import Product from "./pages/Product";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useEffect } from "react";
import CheckOut from "./pages/CheckOut";
import Order from "./pages/Order";
import MyOrders from "./pages/MyOrders";
import { useQueryClient } from "react-query";
import { useProfile } from "./api/api";
import { IUser } from "./types/types";

const App = () => {
  const queryClient = useQueryClient();
  const cachedUser = queryClient.getQueryData<IUser | undefined>("user");
  const { data: profileResponse, refetch } = useProfile();
  const location = useLocation();
  useEffect(() => {
    if (!cachedUser && !profileResponse?.response) {
      refetch();
    }
  }, [cachedUser, profileResponse?.response, refetch, location]);
  const user = cachedUser || profileResponse?.response;
  return (
    <Routes>
      {/* unprotected routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<Products />} />

      {/* protected routes */}
      <Route
        path="/product/:productId"
        element={user ? <Product /> : <Login />}
      />
      <Route path="/cart" element={user ? <Cart /> : <Login />} />
      <Route path="/checkout" element={user ? <CheckOut /> : <Login />} />
      <Route path="/order/:addressId?" element={user ? <Order /> : <Login />} />
      <Route path="/myOrders" element={user ? <MyOrders /> : <Login />} />
    </Routes>
  );
};

export default App;
