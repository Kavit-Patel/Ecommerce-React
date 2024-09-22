import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { MdCurrencyRupee } from "react-icons/md";
import { useFetchSingleProduct, useIncreaseQuantity } from "../api/api";
import { useQueryClient } from "react-query";
import { ICart, IProduct, IUser } from "../types/types";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { addToCartLs } from "../utilityFunctions/localStorageCRUD";

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const queryClient = useQueryClient();
  const user: IUser | undefined = queryClient.getQueryData("user");
  const cachedCart: ICart[] | undefined = queryClient.getQueryData([
    "cart",
    user?._id,
  ]);
  const { isLoading: isProductLoading, refetch } =
    useFetchSingleProduct(productId);
  const product: IProduct | undefined = queryClient.getQueryData([
    "product",
    productId,
  ]);
  const { mutateAsync: incQuantMutate } = useIncreaseQuantity();
  useEffect(() => {
    if (!product) {
      refetch();
    }
  }, [product, refetch]);
  const handleAddToCart = (prod: IProduct) => {
    if (!user?._id) {
      toast.info("Login to add items to cart !");
      navigate("/login");
      return;
    }
    const cacheExists = cachedCart?.find(
      (cachedItem) => cachedItem.product._id === prod._id
    );
    if (cacheExists) {
      incQuantMutate(
        { userId: cacheExists.user, cartId: cacheExists._id },
        {
          onSuccess: (data) => {
            const updatedCart = cachedCart?.map((cart) => {
              if (cart._id === data.response?._id) {
                return { ...cart, quantity: data.response?.quantity };
              }
              return cart;
            });
            queryClient.setQueryData(["cart", cacheExists.user], updatedCart);
          },
        }
      ).then(() => navigate("/cart"));
    } else {
      addToCartLs(user._id, prod);
      navigate("/cart");
    }
  };
  const colors: string[] = [
    "#000000",
    "#781DBC",
    "#E10000",
    "#E1B000",
    "#E8E8E8",
  ];
  const memorySizes: string[] = ["128GB", "256GB", "512GB", "1TB"];
  const specification: { name: string; spec: string; image: string }[] = [
    { name: "Screen size", spec: '5.7"', image: "../../images/screensize.png" },
    { name: "CPU", spec: "Apple A16 Bionic", image: "../../images/chip.png" },
    { name: "Number of Cores", spec: "6", image: "../../images/core.png" },
    {
      name: "Main camera",
      spec: "48-12-12 MP",
      image: "../../images/backCamera.png",
    },
    {
      name: "Front camera",
      spec: "12 MP",
      image: "../../images/frontCamera.png",
    },
    {
      name: "Battery capacity",
      spec: "4323 mAh",
      image: "../../images/battery.png",
    },
  ];
  if (!productId) {
    return <div>Product ID not found!</div>;
  }
  return (
    <main className="w-full bg-[#DFDFDF] flex justify-center">
      <div className="w-[375px] md:w-[800px] lg:w-[1000px] bg-[#f5f5f5]">
        {isProductLoading && <Loader />}
        {product && (
          <section>
            <div className="px-8 path flex gap-3 py-3 text-gray-500"></div>
            <div className="w-full h-[896px] py-8 md:py-0 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8">
              <div className="h-[672px] flex-1 flex justify-center items-center">
                <img
                  className="md:w-2/3"
                  src={product.image}
                  alt={product.name}
                />
              </div>
              <div className="productDetail h-full flex-1 flex flex-col justify-center ml-8 md:ml-1 gap-3 md:gap-6">
                <div className="title text-xl md:text-2xl lg:text-3xl font-semibold">
                  {product.name}
                </div>
                <div className="flex gap-5 text-2xl font-semibold">
                  <span className="price">
                    <span className="flex items-center">
                      <MdCurrencyRupee />
                      <span>{product.price}</span>
                    </span>
                  </span>
                  <span className="subPrice line-through text-gray-400">
                    <span className="flex items-center">
                      <MdCurrencyRupee />
                      <span>
                        {(product.price + product.price * 1.4).toFixed(0)}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="color flex gap-5 items-center">
                  <span>Select color :</span>
                  <span className="flex gap-3">
                    <span className="selectColor w-full flex gap-1">
                      {colors.map((color) => (
                        <span
                          key={color}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: `${color}` }}
                        ></span>
                      ))}{" "}
                    </span>
                  </span>
                </div>
                <div className="memory flex gap-1.5 md:gap-3">
                  {memorySizes.map((memory) => (
                    <span
                      key={memory}
                      className="flex justify-center items-center w-20 h-10 border border-gray-400 px-8 py-3 text-gray-600"
                    >
                      {memory}
                    </span>
                  ))}
                </div>
                <div className="specification w-full flex flex-wrap gap-2">
                  {specification.map((spec) => (
                    <div
                      key={spec.name}
                      className=" w-36 h-16 bg-[#dedede] flex justify-center items-center text-xs text-gray-600"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <img src={spec.image} alt={spec.name} />
                        <div className="">
                          <p>{spec.name}</p>
                          <p>{spec.spec}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs pr-14">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                  porro quisquam dolor quasi, omnis adipisci aut excepturi
                  consequuntur repudiandae modi doloribus, aperiam aspernatur
                  eum facilis, numquam vel consequatur neque nobis quis!
                  Doloremque, earum vero?...
                </div>
                <div className="w-[85%] flex flex-col md:flex-row justify-around gap-2">
                  <Link
                    className="lg:w-1/2 px-3 h-10 bg-gray-100 border border-black rounded-sm flex justify-center items-center transition-all hover:scale-105 active:scale-100"
                    to="#"
                  >
                    Add to Wishlist
                  </Link>
                  <div
                    className="addToCart cursor-pointer lg:w-1/2 px-3 h-10 bg-black rounded-sm text-white flex justify-center items-center transition-all hover:scale-105 active:scale-100"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Product;
