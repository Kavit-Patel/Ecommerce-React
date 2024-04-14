const OrderSteps = ({ path }: { path: string }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full  flex items-center gap-3">
        <div className="w-fit flex items-center gap-1">
          <img
            className={`${
              path.startsWith("/checkout") ? "bg-gray-800" : "bg-slate-400"
            } p-1 rounded-full w-4 h-4`}
            src="../images/location.png"
            alt="location"
          />
          <span
            className={`${
              path.startsWith("/checkout") ? "" : "text-slate-400"
            } text-[10px] font-semibold`}
          >
            <p>Step 1</p>
            <p>Address</p>
          </span>
        </div>
        <div className="w-[35%] h-0.5 bg-slate-300"></div>
        <div className="w-fit flex items-center gap-1">
          <img
            className={`${
              path.startsWith("/order") ? "bg-gray-800" : "bg-slate-400"
            } p-1 rounded-full w-4 h-4`}
            src="../images/payment.png"
            alt="location"
          />
          <span
            className={`text-[10px] font-semibold ${
              path.startsWith("/order") ? "" : "text-slate-400"
            }`}
          >
            <p>Step 2</p>
            <p>Payment</p>
          </span>
        </div>
        <div className="w-[35%] h-0.5 bg-slate-300"></div>
        <div className="w-fit flex items-center gap-1">
          <img
            className="bg-slate-400 p-1 rounded-full w-4 h-4"
            src="../images/shipping.png"
            alt="location"
          />
          <span className="text-[10px] font-semibold text-slate-400">
            <p>Step 3</p>
            <p>Shipping</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSteps;
