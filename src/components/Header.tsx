export const Header = () => {
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
            />
          </p>
          <ul className="hidden lg:flex lg:gap-10 text-[#989898]">
            <a href="/" className="">
              Home
            </a>
            <li className="">Abount</li>
            <li className="">Contact Us</li>
            <li className="">Blog</li>
          </ul>
          <p className="showCart flex flex-col mt-32 md:mt-0 ml-24 md:ml-0 rounded-md md:rounded-none shadow-lg md:shadow-none border-2 md:border-none -z-10 md:z-30 bg-white md:bg-inherit md:flex-row p-4 md:p-0 gap-4 md:gap-1">
            <img src="../../images/Favorites.png" alt="Favorites" />
            <span className="relative myCart cursor-pointer">
              <img src="../../images/Cart.png" alt="Cart" />
              <span className="navCart absolute -top-3 -right-1.5 text-green-700 font-semibold">
                0
              </span>
            </span>
            <img src="../../images/User.png" alt="User" />
          </p>
          <p className="hamburger md:hidden cursor-pointer">
            <img src="../../images/Burger.png" alt="Ham-burger" />
          </p>
        </div>
        <div className="hidden w-full px-8 h-[48px] bg-[#2e2e2e] lg:flex justify-between">
          <a
            href="/src/pages/products.html"
            className="flex items-center text-gray-400 gap-2"
          >
            <img
              className="text-black"
              src="../../images/Vector-36.png"
              alt="Phone"
            />
            <span>Phone</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-31.png"
              alt="Computers"
            />
            <span>Computers</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-14.png"
              alt="Smart Watches"
            />
            <span>Smart Watches</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-3.png"
              alt="Cameras"
            />
            <span>Cameras</span>
          </a>
          <a href="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-10.png"
              alt="Headphones"
            />
            <span>Headphones</span>
          </a>

          <a href="#" className="flex items-center text-gray-400 gap-2">
            <img
              className="text-black"
              src="../../images/Vector-14.png"
              alt="Gaming"
            />
            <span>Gaming</span>
          </a>
        </div>
      </div>
    </div>
  );
};
