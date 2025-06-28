import { Locate, LocateIcon, Map, MapPin } from "lucide-react";
import React from "react";

const FoodWasteMatter = () => {
  return (
    <>
      <section className=" p-[40px] lg:p-[10px_10px]">
        <h2 className="text-[20px] font-bold p-1 ">Available Surplus Items</h2>
        <p className="text-[15px] text-gray-500">4 items available</p>
      </section>
      <section className="py-8 px-4">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {/* Card 1 */}
          <div className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl">
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2113&q=80"
                className="w-full h-[150px] object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Green Packaging"
              />
            </div>
            <div className="p-4 border-2 border-t-0 border-gray-100 group-hover:border-orange-200 transition-colors duration-300">
              <h3 className="font-semibold text-lg mb-2">
                Fresh Pasta & vegetable Sauce
              </h3>
              <p className="text-gray-600 mb-4">
                Homemade pasta with our signature vegetable sauce. Perfect for a
                quick dinner!
              </p>
              <div>
                <p className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-[15px] h-[15px]" /> Lois chop
                </p>
                <p className="flex items-center gap-2 text-green-700 font-bold">
                  ₦10,000
                  <span className=" text-gray-400  line-through">₦20,000 </span>
                </p>
              </div>
              <button className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300">
                Add to cart
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl">
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                className="w-full h-[150px] object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Food Waste Reduction"
              />
            </div>
            <div className="p-4 border-2 border-t-0 border-gray-100 group-hover:border-orange-200 transition-colors duration-300">
              <h3 className="font-semibold text-lg mb-2">
                Fresh Pasta & vegetable Sauce
              </h3>
              <p className="text-gray-600 mb-4">
                Homemade pasta with our signature vegetable sauce. Perfect for a
                quick dinner!
              </p>
              <div>
                <p className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-[15px] h-[15px]" /> Lois chop
                </p>
                <p className="flex items-center gap-2 text-green-700 font-bold">
                  ₦10,000
                  <span className=" text-gray-400  line-through">₦20,000 </span>
                </p>
              </div>
              <button className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300">
                Add to cart
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl">
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                className="w-full h-[150px] object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Local Farmers"
              />
            </div>
            <div className="p-4 border-2 border-t-0 border-gray-100 group-hover:border-orange-200 transition-colors duration-300">
              <h3 className="font-semibold text-lg mb-2">
                Fresh Pasta & vegetable Sauce
              </h3>
              <p className="text-gray-600 mb-4">
                Homemade pasta with our signature vegetable sauce. Perfect for a
                quick dinner!
              </p>
              <div>
                <p className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-[15px] h-[15px]" /> Lois chop
                </p>
                <p className="flex items-center gap-2 text-green-700 font-bold">
                  ₦10,000
                  <span className=" text-gray-400  line-through">₦20,000 </span>
                </p>
              </div>
              <button className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300">
                Add to cart
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl">
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                className="w-full h-[150px] object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Carbon Neutral"
              />
            </div>
            <div className="p-4 border-2 border-t-0 border-gray-100 group-hover:border-orange-200 transition-colors duration-300">
              <h3 className="font-semibold text-lg mb-2">
                Fresh Pasta & vegetable Sauce
              </h3>
              <p className="text-gray-600 mb-4">
                Homemade pasta with our signature vegetable sauce. Perfect for a
                quick dinner!
              </p>
              <div>
                <p className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-[15px] h-[15px]" /> Lois chop
                </p>
                <p className="flex items-center gap-2 text-green-700 font-bold">
                  ₦10,000
                  <span className=" text-gray-400  line-through">₦20,000 </span>
                </p>
              </div>
              <button className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FoodWasteMatter;
