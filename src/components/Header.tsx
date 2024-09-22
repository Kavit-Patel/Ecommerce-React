import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { ICart, IUser } from "../types/types";
import { getCartItems } from "../utilityFunctions/localStorageCRUD";
import { useFetchUserCart, useProfile, useUserLogOut } from "../api/api";
import { NavLink } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const cachedUser: IUser | undefined = queryClient.getQueryData("user");

  useProfile();
  const { refetch: refetchLogOut } = useUserLogOut();
  const lsCart: ICart[] | [] = getCartItems("ecommerceCart");
  const [user, setUser] = useState<IUser | undefined>(cachedUser);
  const [cart, setCart] = useState<ICart[] | undefined>(undefined);
  const [show, setShow] = useState<{ cart: boolean; user: boolean }>({
    cart: false,
    user: false,
  });

  const { refetch: refetchCart } = useFetchUserCart(user?._id);
  const cachedCart: ICart[] | undefined = queryClient.getQueryData([
    "cart",
    user?._id,
  ]);

  useEffect(() => {
    setCart([...getCartItems("ecommerceCart"), ...(cachedCart || [])]);
  }, [cachedCart, lsCart.length]);

  useEffect(() => {
    if (!user && cachedUser) {
      setUser(cachedUser);
    }
  }, [cachedUser, user]);
  useEffect(() => {
    if (user && (!cachedCart || cachedCart.length === 0)) {
      refetchCart().then((res) => {
        res.data?.response &&
          setCart([...res.data.response, ...getCartItems("ecommerceCart")]);
      });
    }
  }, [user, refetchCart, cachedCart]);

  useEffect(() => {
    const handleClick = () => {
      setShow(() => ({ user: false, cart: false }));
    };
    window.addEventListener("click", () => handleClick());

    return () => window.removeEventListener("click", () => handleClick());
  }, []);
  return (
    <div className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px]">
        <div className="w-full flex items-center justify-between px-8 md:px-4 h-[88px] bg-[#f5f5f5]">
          <img src="../../images/Logo.png" alt="Logo" />
          <p className="hidden md:block relative">
            <img
              className="absolute top-4 left-3"
              src="../../images/Search.png"
              alt="Search"
            />
            <input
              className="bg-[#dfdfdf] md:w-[333px] h-[56px] pl-10 rounded-sm"
              type="text"
              placeholder="Search"
              onChange={(e) => {
                const search = e.target.value;
                // if (search.length !== 0) {
                navigate("/products", { state: { search } });
                // }
              }}
            />
          </p>
          <ul className="hidden lg:flex lg:gap-10 text-[#989898]">
            <Link to="/" className="">
              Home
            </Link>
            <li className="">Abount</li>
            <li className="">Contact Us</li>
            <li className="">Blog</li>
          </ul>
          <p
            className={`${
              show.cart ? "z-20" : "-z-20"
            }  -z-10 md:z-10 flex flex-col mt-32 md:mt-0 ml-24 md:ml-0 rounded-md md:rounded-none shadow-lg md:shadow-none border-2 md:border-none  bg-white md:bg-inherit md:flex-row p-4 md:p-0 gap-4 md:gap-1`}
          >
            <img src="../../images/Favorites.png" alt="Favorites" />
            <NavLink to="/cart" className="relative myCart cursor-pointer">
              <img src="../../images/Cart.png" alt="Cart" />
              <span className="navCart absolute -top-3 -right-1.5 text-black-950 font-semibold">
                {user ? cart?.length : ""}
              </span>
            </NavLink>
            <span className="relative">
              <span
                className={`${
                  show.user ? "block" : "hidden"
                } absolute w-16 md:w-20 md:border-2 shadow-xl md:shadow-2xl -right-[84px] md:-right-4 md:top-12  flex flex-col bg-white`}
              >
                {user ? (
                  <span className="flex flex-col">
                    <span className="text-sm md:text:md hover:bg-slate-100 hover:font-semibold active:bg-slate-200  active:scale-95  px-1.5 py-1">
                      {user?.name?.toUpperCase()}
                    </span>
                    <Link
                      onClick={() =>
                        setShow((prev) => ({ ...prev, user: !prev.user }))
                      }
                      className="text-sm md:text:md hover:bg-slate-100 hover:font-semibold active:bg-slate-200  active:scale-95  px-1.5 py-1"
                      to="/myorders"
                    >
                      myOrders
                    </Link>
                    <Link
                      onClick={() => {
                        refetchLogOut();
                        setShow((prev) => ({ ...prev, user: !prev.user }));
                        setUser(undefined);
                      }}
                      className="text-sm md:text:md hover:bg-slate-100 hover:font-semibold active:bg-slate-200  active:scale-95  px-1.5 py-1"
                      to="#"
                    >
                      LogOut
                    </Link>
                  </span>
                ) : (
                  <>
                    <Link
                      onClick={() =>
                        setShow((prev) => ({ ...prev, user: !prev.user }))
                      }
                      className="text-sm md:text:md hover:bg-slate-100 hover:font-semibold active:bg-slate-200  active:scale-95  px-1.5 py-1"
                      to="/register"
                    >
                      Register
                    </Link>
                    <Link
                      onClick={() =>
                        setShow((prev) => ({ ...prev, user: !prev.user }))
                      }
                      className="text-sm md:text:md hover:bg-slate-100 hover:font-semibold active:bg-slate-200 active:scale-95  px-1.5 py-1"
                      to="/login"
                    >
                      Login
                    </Link>
                  </>
                )}
              </span>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  setShow((prev) => ({ ...prev, user: !prev.user }));
                }}
                className="  cursor-pointer"
                src="../../images/User.png"
                alt="User"
              />
            </span>
          </p>
          <p className="hamburger md:hidden cursor-pointer">
            <img
              onClick={(e) => {
                e.stopPropagation();
                setShow((prev) => ({ ...prev, cart: !prev.cart }));
              }}
              src="../../images/Burger.png"
              alt="Ham-burger"
            />
          </p>
        </div>
        <div className="hidden w-full px-8 h-[48px] bg-[#2e2e2e] lg:flex justify-between">
          <Link
            to="/products"
            className="flex items-center text-gray-400 gap-2"
          >
            <img
              className="text-black"
              src="../../images/Vector-36.png"
              alt="Phone"
            />
            <span>Phone</span>
          </Link>
          <Link to="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-31.png"
              alt="Computers"
            />
            <span>Computers</span>
          </Link>
          <Link to="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-14.png"
              alt="Smart Watches"
            />
            <span>Smart Watches</span>
          </Link>
          <Link to="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-3.png"
              alt="Cameras"
            />
            <span>Cameras</span>
          </Link>
          <Link to="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-10.png"
              alt="Headphones"
            />
            <span>Headphones</span>
          </Link>

          <Link to="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-14.png"
              alt="Gaming"
            />
            <span>Gaming</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
