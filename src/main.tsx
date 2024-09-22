import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header.tsx";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer.tsx";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    {/* <React.StrictMode> */}
    <BrowserRouter>
      <Header />
      <ToastContainer />

      <App />
      <Footer />
    </BrowserRouter>
    {/* </React.StrictMode> */}
  </QueryClientProvider>
);
