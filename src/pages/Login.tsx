import { useEffect, useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch } from "../store/Store";
import { fetchAsyncUser } from "../store/user/userApi";
import { setVanillaUser } from "../store/user/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [userDetails, setUserDetails] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const handleUserDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    await dispatch(fetchAsyncUser(userDetails));
    setLoader(false);
  };

  //if redirected from vanilla-ecommerce front end logic
  const [searchParams] = useSearchParams();
  const queryCart = searchParams.get("queryCart");
  useEffect(() => {
    if (queryCart) {
      const vanillaCart = JSON.parse(decodeURIComponent(queryCart));
      dispatch(setVanillaUser({ status: true, data: vanillaCart }));
      navigate("/login");
    }
  }, [dispatch, queryCart, navigate]);
  //venilla-ecommerce redirection logic ends
  return (
    <div className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5] flex justify-center items-center">
        <section className="w-full h-full py-5  flex justify-center items-center">
          <form
            onSubmit={(e) => handleSubmit(e)}
            action=""
            className="border-2 p-6 w-full md:w-[45%]  flex flex-col gap-2 shadow-xl"
          >
            <div className="text-center mb-4 text-xl font-semibold border-b-2 border-black w-fit pb-1 self-center">
              LogIn
            </div>

            <div className="w-full flex flex-col gap-1">
              <label htmlFor="name">Email</label>
              <input
                onChange={(e) => handleUserDetails(e)}
                className="p-2 rounded-md outline-none border border-[#EEEEF4]"
                name="email"
                type="email"
                placeholder="johndoe@gmail.com"
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="name">Password</label>
              <div className="w-full flex items-center justify-between ">
                <input
                  onChange={(e) => handleUserDetails(e)}
                  className="p-2 w-[90%] rounded-md outline-none border border-[#EEEEF4]"
                  name="password"
                  type={`${seePassword ? "text" : "password"}`}
                  placeholder={`${
                    seePassword ? "enterpassword" : "*****************"
                  }`}
                />
                <FaEye
                  onClick={() => setSeePassword((prev) => !prev)}
                  className={`${seePassword ? "block" : "hidden"} text-xl`}
                />
                <FaEyeSlash
                  onClick={() => setSeePassword((prev) => !prev)}
                  className={`${seePassword ? "hidden" : "block"} text-xl`}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <input
                className=" scale-110"
                type="checkbox"
                name="checkbox"
                id="checkbox"
              />
              <p className="">Remember me</p>
              <Link className="text-[#5F00D9] ml-auto" to="#">
                Forget Password
              </Link>
            </div>

            <button
              type="submit"
              className={`bg-[#D8DDE2] transition-all 
                  ${
                    loader ? "animate-pulse" : ""
                  } active:scale-95 hover:bg-[#B6BCC2] hover:font-semibold cursor-pointer
                  
               p-2.5 rounded-md`}
            >
              {loader ? (
                <div className="flex items-end justify-center gap-1 py-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              ) : (
                <div className="">Login</div>
              )}
            </button>
            <Link
              to="/register"
              className={`bg-[#e8e8e8] text-center transition-all active:scale-95 hover:bg-[#B6BCC2] hover:font-semibold cursor-pointer
                  
               p-2.5 rounded-md`}
            >
              Create Account
            </Link>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
