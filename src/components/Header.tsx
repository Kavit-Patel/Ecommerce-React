import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store/Store";

export const Header = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state: RootState) => state.cart);
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
          <p className="showCart flex flex-col mt-32 md:mt-0 ml-24 md:ml-0 rounded-md md:rounded-none shadow-lg md:shadow-none border-2 md:border-none -z-10 md:z-30 bg-white md:bg-inherit md:flex-row p-4 md:p-0 gap-4 md:gap-1">
            <img src="../../images/Favorites.png" alt="Favorites" />
            <NavLink to="/cart" className="relative myCart cursor-pointer">
              <img src="../../images/Cart.png" alt="Cart" />
              <span className="navCart absolute -top-3 -right-1.5 text-black-950 font-semibold">
                {cartItems.length}
              </span>
            </NavLink>
            <img src="../../images/User.png" alt="User" />
          </p>
          <p className="hamburger md:hidden cursor-pointer">
            <img src="../../images/Burger.png" alt="Ham-burger" />
          </p>
        </div>
        <div className="hidden w-full px-8 h-[48px] bg-[#2e2e2e] lg:flex justify-between">
          <Link
            to="/src/pages/products.html"
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
