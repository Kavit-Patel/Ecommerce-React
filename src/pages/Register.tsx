import { useEffect, useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "../store/Store";
import { registerAsyncUser } from "../store/user/userApi";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.user);
  const [userDetails, setUserDetails] = useState<{
    name: string;
    surname: string;
    email: string;
    password: string;
    repeatPassword: string;
  }>({ name: "", surname: "", email: "", password: "", repeatPassword: "" });
  const [seePassword, setSeePassword] = useState<{
    password: boolean;
    repeatPassword: boolean;
  }>({ password: false, repeatPassword: false });
  const [allowSubmit, setAllowSubmit] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const handleUserDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);
    await dispatch(registerAsyncUser(userDetails));
    setLoader(false);
  };
  useEffect(() => {
    if (status === "success") {
      navigate("/");
    }
  }, [navigate, status]);
  return (
    <div className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5] flex justify-center items-center">
        <section className="w-full h-full  py-5 flex justify-center items-center">
          <form
            onSubmit={(e) => handleSubmit(e)}
            action=""
            className="border-2 p-6 w-full md:w-[80%] lg:w-[65%]  flex flex-col gap-2 shadow-xl"
          >
            <div className="text-center mb-4 text-xl font-semibold border-b-2 border-black w-fit pb-1 self-center">
              Register
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-8 justify-between">
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="name">Name</label>
                <input
                  onChange={(e) => handleUserDetails(e)}
                  className="p-2 rounded-md outline-none border border-[#EEEEF4]"
                  name="name"
                  type="text"
                  placeholder="John"
                />
              </div>
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="name">Surname</label>
                <input
                  onChange={(e) => handleUserDetails(e)}
                  className="p-2 rounded-md outline-none border border-[#EEEEF4]"
                  name="surname"
                  type="text"
                  placeholder="Doe"
                />
              </div>
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
                  type={`${seePassword.password ? "text" : "password"}`}
                  placeholder={`${
                    seePassword.password
                      ? "choosepassword"
                      : "*****************"
                  }`}
                />
                <FaEye
                  onClick={() =>
                    setSeePassword((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className={`${
                    seePassword.password ? "block" : "hidden"
                  } text-xl`}
                />
                <FaEyeSlash
                  onClick={() =>
                    setSeePassword((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                  className={`${
                    seePassword.password ? "hidden" : "block"
                  } text-xl`}
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="name">Repeat Password</label>
              <div className="w-full flex items-center justify-between ">
                <input
                  onChange={(e) => handleUserDetails(e)}
                  className="p-2 w-[90%] rounded-md outline-none border border-[#EEEEF4]"
                  name="repeatPassword"
                  type={`${seePassword.repeatPassword ? "text" : "password"}`}
                  placeholder={`${
                    seePassword.repeatPassword
                      ? "repeatpassword"
                      : "*****************"
                  }`}
                />
                <FaEye
                  onClick={() =>
                    setSeePassword((prev) => ({
                      ...prev,
                      repeatPassword: !prev.repeatPassword,
                    }))
                  }
                  className={`${
                    seePassword.repeatPassword ? "block" : "hidden"
                  } text-xl`}
                />
                <FaEyeSlash
                  onClick={() =>
                    setSeePassword((prev) => ({
                      ...prev,
                      repeatPassword: !prev.repeatPassword,
                    }))
                  }
                  className={`${
                    seePassword.repeatPassword ? "hidden" : "block"
                  } text-xl`}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                onClick={(e) => {
                  if (e.target instanceof HTMLInputElement) {
                    setAllowSubmit(e.target.checked);
                  }
                }}
                className=" scale-110"
                type="checkbox"
                name="checkbox"
                id="checkbox"
              />
              <p className=" text-xs">
                I agree with{" "}
                <Link className="text-[#5F00D9]" to="#">
                  Terms & Conditions
                </Link>
              </p>
            </div>

            <button
              type="submit"
              disabled={!allowSubmit}
              className={`bg-[#D8DDE2] transition-all ${
                allowSubmit
                  ? `${
                      loader ? "animate-pulse" : ""
                    } active:scale-95 hover:bg-[#B6BCC2] hover:font-semibold cursor-pointer`
                  : "cursor-not-allowed"
              } p-2.5 rounded-md`}
            >
              {allowSubmit ? (
                loader ? (
                  <div className="flex items-end justify-center gap-1 ">
                    <div className="">Creating Account</div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                ) : (
                  "Create Account"
                )
              ) : (
                "Create Account"
              )}
            </button>
            <p className="text-center text-xs">
              Already have an account ?{" "}
              <Link className="text-[#5F00D9]" to="/login">
                Login !
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;
