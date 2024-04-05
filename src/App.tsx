import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Cart from "./pages/Cart";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart/:id?" element={<Cart />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
