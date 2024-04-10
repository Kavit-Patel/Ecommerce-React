import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/Store.ts";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header.tsx";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <Header />
      <ToastContainer />

      <App />
      <Footer />
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </Provider>
);
