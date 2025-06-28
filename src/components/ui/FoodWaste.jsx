import { Bell } from "lucide-react";
import React from "react";

const FoodWaste = () => {
  return (
    <section className="flex flex-col items-center">
      <div className="text-center p-[40px] lg:p-[50px_190px]">
        <h1 className="text-[30px] font-bold p-1 mt-[50px]">
          Food Surplus Marketplace
        </h1>
        <p className="text-[15px] text-gray-500">
          Discover discounted surplus food from local restaurants. Help reduce
          food waste while enjoying great meals at lower prices.
        </p>
      </div>
      <div className="border flex flex-col gap-3 border-gray-300 rounded-lg p-3.5 w-full max-w-[350px]">
        <h2 className="flex font-bold text-xl">
          <Bell /> Surplus Notifications
        </h2>
        <p className="text-gray-500">
          Get notified when restaurants post new surplus food items
        </p>
        <div className="flex justify-between">
          <h6>Enable notifications</h6> <input type="checkbox" />
        </div>
      </div>
    </section>
  );
};

export default FoodWaste;
