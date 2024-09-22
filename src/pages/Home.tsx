import { Link } from "react-router-dom";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import { useQueryClient } from "react-query";
import { IProduct } from "../types/types";
import { useFetchProducts } from "../api/api";

const Home = () => {
  const queryClient = useQueryClient();
  const products: IProduct[] | undefined = queryClient.getQueryData("products");
  const {
    data: fetchedProductsResponse,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useFetchProducts();
  useEffect(() => {
    if (!products) {
      refetchProducts();
    }
  }, [products, refetchProducts]);

  return (
    <div className=" bg-[#DFDFDF] w-full flex justify-center">
      <div className={`w-[375px] md:w-[800px] lg:w-[1000px] `}>
        {/* Hero Section Starts */}
        <div className="w-full h-[632px] px-8 bg-[#211C24] flex flex-col-reverse lg:flex-row justify-evenly items-center">
          <div className="flex flex-col gap-2 justify-center pl-20 text-xs md:text-sm lg:text-lg">
            <p className="text-gray-500">Pro-Beyond</p>
            <p className="text-xl md:text-4xl lg:text-7xl text-gray-400 font-thin">
              IPhone 14 <span className="font-normal">Pro</span>
            </p>
            <p className="text-gray-500">
              Created to change everything for the better. For everything
            </p>
            <Link
              to="/products"
              className="button border border-gray-400 text-gray-400 px-8 py-1 rounded-sm w-fit transition-all hover:scale-105 active:scale-100"
            >
              Shop Now
            </Link>
          </div>
          <img
            className="w-44 md:w-64 lg:w-fit"
            src="../../images/Iphone Image.png"
            alt="Iphone image"
          />
        </div>

        {/* Hero Section ends  */}

        {/* Presentation Section starts  */}

        <div className="w-full h-[800px] flex flex-col lg:flex-row">
          <div className="flex-1">
            <div className="h-1/2 relative flex-1 flex flex-col">
              <img
                className="h-[80%] lg:w-[50%] absolute top-4 left-4 lg:top-10 md:left-0 object-cover"
                src="../../images/PlayStation.png"
                alt="playstation"
              />
              <div className="w-full min-h-full pl-[46%] flex flex-col justify-center gap-2 bg-white">
                <p className="text-2xl md:text-4xl font-semibold">
                  Playstation 5
                </p>
                <p className="text-xs text-gray-500">
                  Incredibly powerful CPUs, and an SSD with Intregrated I/O will
                  redefine your PlayStation experience
                </p>
              </div>
              <div className="flex w-full min-h-full">
                <div className="bg-[#ededed] flex flex-1 gap-6">
                  <img className="" src="../../images/Hero2.png" alt="Hero-2" />
                  <div className="text-2xl flex flex-col justify-center gap-1">
                    <h1>Apple</h1>
                    <h1>
                      AirPods <span className="font-bold">Max</span>
                    </h1>
                    <p className="text-xs">
                      Computational audio. Listen It's powerful
                    </p>
                  </div>
                </div>
                <div className="flex-1 bg-[#353535] flex items-center gap-2">
                  <img
                    className="h-[54%] md:h-[40%]"
                    src="../../images/image 36-1.png"
                    alt="Apple Vision"
                  />
                  <div className="text-gray-100 text-xl md:text-2xl flex flex-col gap-1">
                    <h1>Apple</h1>
                    <h1>
                      Vision <span className="font-bold">Pro</span>
                    </h1>
                    <p className="text-xs">
                      An immersive way to experience entertainment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-between pl-10 bg-[#ededed]">
            <div className="ml-auto flex flex-col gap-4">
              <h1 className="text-2xl md:text-5xl">
                Macbook <span className="font-bold">Air</span>
              </h1>
              <p className="w-[80%] md:w-[50%] text-xs text-gray-500">
                The new 15-inch MacBook Air makes room for more of what you love
                with a spacious Liquid Retina display
              </p>
              <Link
                to="/products"
                className="button mr-auto border border-black px-5 py-1.5 md:px-10 md:py-3 rounded-sm transition-all hover:scale-105 active:scale-100"
              >
                Buy Now
              </Link>
            </div>
            <img
              className="h-[80%] md:h-[70%]"
              src="../../images/Screen.png"
              alt="Screen"
            />
          </div>
        </div>
        {/* Presentation Section ends  */}

        {/* Category Section starts  */}

        <div className="w-full h-[1000px] md:h-[260px] px-8 flex flex-col justify-center gap-5 lg:mt-0">
          <h2 className="font-semibold text-xl text-center md:text-left">
            Browse By Category
          </h2>
          <div
            id="categorySection"
            className="w-full md:h-[128px] flex flex-col md:flex-row gap-3 justify-center items-center"
          >
            {isProductsLoading && <Loader />}
            {fetchedProductsResponse?.response?.map(
              (product) =>
                product.section === "category" && (
                  <div key={product._id} className="categoryCard">
                    <Link className="" to={`/product/${product._id}`}>
                      <img
                        className="object-cover"
                        src={product.image}
                        alt=""
                      />
                    </Link>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Category Section ends  */}

        {/* Featured Products Section starts  */}

        <div className="flex flex-col px-2 py-8 gap-4">
          <div className="flex justify-center md:justify-start gap-3">
            <p className="font-semibold">New Arrival</p>
            <p>Bestseller</p>
            <p>Featured Products</p>
          </div>
          <div
            id="featuredSection"
            className="flex justify-center md:justify-between flex-wrap gap-2"
          >
            {isProductsLoading && <Loader />}
            {fetchedProductsResponse?.response?.map(
              (product) =>
                product.section === "newArrival" && (
                  <div
                    key={product._id}
                    className="featuredCard bg-[#eeebeb] border w-[230px] h-[432px] flex flex-col justify-center items-center gap-4 rounded-sm"
                  >
                    <img src={product.image} alt={product.name} />
                    <h2 className="text-sm px-4 font-semibold text-center h-16">
                      {product.name}
                    </h2>
                    <p className="font-bold text-lg">{product.price}</p>
                    <Link
                      to={`/product/${product._id}`}
                      className="flex justify-center items-center bg-black h-12 px-10 text-white rounded-md transition-all hover:scale-105 active:scale-100"
                    >
                      Buy Now
                    </Link>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Featured Products Section ends  */}

        {/* Discounted products Section starts  */}

        <div className="px-20 flex flex-col gap-12">
          <h2 className="text-xl font-semibold">Discounted up to - 50%</h2>
          <div id="discountedSection" className="flex flex-wrap gap-2">
            {isProductsLoading && <Loader />}
            {fetchedProductsResponse?.response?.map(
              (product) =>
                product.section === "discounted" && (
                  <div
                    key={product._id}
                    className="w-[200px] h-[432px] bg-[#eeebeb] flex flex-col justify-center items-center gap-4"
                  >
                    <img src={product.image} alt={product.name} />
                    <h2 className="h-16 text-sm px-4 font-semibold text-center">
                      {product.name}
                    </h2>
                    <p className="font-bold text-lg">{product.price}</p>
                    <Link
                      to={`/product/${product._id}`}
                      className="flex justify-center items-center bg-black h-12 px-10 text-white rounded-md transition-all hover:scale-105 active:scale-100"
                    >
                      Buy Now
                    </Link>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Discounted products Section ends */}
      </div>
    </div>
  );
};

export default Home;
