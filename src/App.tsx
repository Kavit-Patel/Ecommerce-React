import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
