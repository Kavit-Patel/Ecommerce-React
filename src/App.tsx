import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";

import Product from "./pages/Product";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { RootState } from "./store/Store";
import { useEffect } from "react";
import CheckOut from "./pages/CheckOut";
import Order from "./pages/Order";

const App = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (
      user.status === "success" &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/");
    } else if (
      user.status !== "success" &&
      (location.pathname.startsWith("/cart") ||
        location.pathname.startsWith("/order") ||
        location.pathname === "/checkout")
    ) {
      navigate("/login");
    }
  }, [navigate, user.status, location.pathname]);
  return (
    <Routes>
      {/* unprotected routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* protected routes */}
      <Route path="/product/:productId" element={<Product />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart/:productId?" element={<Cart />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/order/:addressId?" element={<Order />} />
    </Routes>
  );
};

export default App;
