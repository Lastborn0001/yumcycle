import React from "react";

const FoodWasteMatter = () => {
  return (
    <>
      <section className="text-center p-[40px] lg:p-[10px_100px]">
        <h2 className="text-[20px] font-bold p-1 ">Why Food Waste Matters</h2>
        <p className="text-[15px] text-gray-500">
          Approximately one-third of all food produced globally is wasted. This
          not only means that valuable resources used in production are wasted,
          but food waste is also a significant contributor to greenhouse gas
          emissions. By participating in our initiatives, you're helping to
          create a more sustainable food system.
        </p>
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
                Green Packaging Initiative
              </h3>
              <p className="text-gray-600 mb-4">
                All our partner restaurants use biodegradable packaging made
                from plant-based materials.
              </p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300">
                Join Initiative
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
                Food Waste Reduction
              </h3>
              <p className="text-gray-600 mb-4">
                Our platform helps restaurants reduce food waste by optimizing
                portion sizes and donations.
              </p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300">
                Learn More
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
              <h3 className="font-semibold text-lg mb-2">Donate a Meal</h3>
              <p className="text-gray-600 mb-4">
                Add ₦100 to your order to donate a meal to someone in need. We
                partner with local food banks to distribute meals to those
                facing food insecurity.
              </p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300">
                Join Initiative
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
                Community Composting
              </h3>
              <p className="text-gray-600 mb-4">
                We collect food scraps from our partner restaurants and turn
                them into compost for local community gardens.
              </p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300">
                Join Initiaitve
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FoodWasteMatter;
