import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { ChangeEvent, useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { useQueryClient } from "react-query";
import { productsPriceRange } from "../utilityFunctions/getProductPriceRange";
import { IProduct } from "../types/types";
import { useFetchProducts } from "../api/api";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading: isProductsLoading, refetch: refetchProducts } =
    useFetchProducts();
  const queryClient = useQueryClient();
  const products: IProduct[] | undefined = queryClient.getQueryData("products");
  const [priceRange, setPriceRange] = useState<number[]>(
    productsPriceRange(products)
  );
  useEffect(() => {
    if (products) {
      setPriceRange(productsPriceRange(products));
    }
  }, [products]);
  const [price, setPrice] = useState<{
    min: number;
    max: number;
    current: number;
  }>({
    min: priceRange[priceRange.length - 1],
    max: priceRange[0],
    current: priceRange[0],
  });
  const [visible, setVisible] = useState<{ price: boolean; sortBy: boolean }>({
    price: false,
    sortBy: false,
  });
  const [sortChoice, setSortChoice] = useState<string>("");
  const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortChoice(e.target.value);
  };

  useEffect(() => {
    if (!products) {
      refetchProducts();
      navigate(location.pathname, { state: null });
    }
  }, [products, navigate, location.pathname, refetchProducts]);
  useEffect(() => {
    setPrice({
      min: priceRange[priceRange.length - 1],
      max: priceRange[0],
      current: priceRange[0],
    });
  }, [priceRange]);
  return (
    <main className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5]">
        <section className="w-full px-2 md:px-4 lg:px-8">
          <div className="w-full h-[44rem] flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between my-12">
            <div className="w-64 self-center md:self-start">
              <div className="price flex flex-col gap-3">
                <div
                  onClick={() =>
                    setVisible((prev) => ({ ...prev, price: !prev.price }))
                  }
                  className="flex justify-between pl-1 pr-1 cursor-pointer relative price-line-hidden border-b pb-2 font-semibold"
                >
                  <span>Price</span>
                  <span className={`text-lg`}>
                    {visible.price ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                  </span>
                </div>
                <div
                  className={`${
                    visible.price ? "block" : "hidden"
                  } flex flex-col gap-3`}
                >
                  <div className="flex justify-between text-gray-400">
                    <span>From</span>
                    <span>To</span>
                  </div>
                  <div className="text-xl w-full flex justify-between">
                    <div className="minimum w-24 h-8 border border-gray-400 text-center">
                      {price.min}
                    </div>
                    <div className="maximum w-24 h-8 border border-gray-400 text-center">
                      {price.current}
                    </div>
                  </div>
                  <input
                    min={price.min}
                    max={price.max}
                    value={price.current}
                    type="range"
                    name=""
                    id="priceRange"
                    onChange={(e) =>
                      setPrice((prev) => ({
                        ...prev,
                        current: +e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-3 mt-6">
                <select
                  onChange={(e) => handleSort(e)}
                  className="w-full py-1 bg-inherit flex justify-between cursor-pointer relative price-line-hidden border-b font-semibold"
                >
                  <option value="">Sort By</option>

                  <option
                    className="border hover:bg-gray-100 transition-all active:scale-95"
                    value="LowToHigh"
                  >
                    Low to High
                  </option>
                  <option
                    className="border hover:bg-gray-100 transition-all active:scale-95"
                    value="HighToLow"
                  >
                    High To Low
                  </option>
                  <option
                    className="border hover:bg-gray-100 transition-all active:scale-95"
                    value="A-Z"
                  >
                    A to Z
                  </option>
                  <option
                    className="border hover:bg-gray-100 transition-all active:scale-95"
                    value="Z-A"
                  >
                    Z to A
                  </option>
                </select>
              </div>
            </div>
            <div className="w-[375px] md:w-full h-[44rem] overflow-y-auto">
              <PerfectScrollbar>
                <div
                  id="productSection"
                  className="w-full flex flex-wrap justify-center gap-1.5"
                >
                  {isProductsLoading && (
                    <div className="w-full h-96 flex justify-center items-center">
                      <Loader />
                    </div>
                  )}
                  {products &&
                    products
                      .filter(
                        (filteredProduct) =>
                          filteredProduct.price <= price.current &&
                          (!location.state ||
                          !location.state.search ||
                          location.state.search.length === 0
                            ? true
                            : filteredProduct.name
                                .toLowerCase()
                                .includes(
                                  location?.state?.search?.toLowerCase()
                                ))
                      )
                      .sort((a, b) => {
                        if (sortChoice === "LowToHigh") {
                          return a.price - b.price;
                        } else if (sortChoice === "HighToLow") {
                          return b.price - a.price;
                        } else if (sortChoice === "A-Z") {
                          return a.name.localeCompare(b.name);
                        } else if (sortChoice === "Z-A") {
                          return b.name.localeCompare(a.name);
                        }
                        return 0;
                      })
                      .map(
                        (product) =>
                          product.section === "Products" && (
                            <div
                              key={product._id}
                              className="featuredCard bg-[#eeebeb] border w-[230px] h-[432px] flex flex-col justify-center items-center gap-4 rounded-sm"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-44 h-56"
                              />
                              <h2 className="text-sm px-4 h-8 font-semibold text-center">
                                {product.name}
                              </h2>
                              <p className="font-bold text-lg">
                                <span className="flex items-center">
                                  <MdCurrencyRupee />
                                  <span>{product.price}</span>
                                </span>
                              </p>
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
              </PerfectScrollbar>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Products;
