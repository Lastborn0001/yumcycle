import { BadgeDollarSign, Bell, Clock, Divide } from "lucide-react";
import React from "react";

const Help = () => {
  return (
    <section className="mt-16 mb-16 rounded-xl bg-gray-100 p-8">
      <h2 className="mb-6 text-center text-2xl font-semibold">
        How Food Surplus Works
      </h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Clock className="text-orange-600" />
          </div>
          <h3 className="text-lg font-medium">Restaurants Post Daily</h3>
          <p className="mt-2 text-sm text-gray-500">
            Local restaurants post their surplus food items at the end of each
            day at discounted prices.
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Divide className="text-orange-600" />
          </div>
          <h3 className="text-lg font-medium">Great Discounts</h3>
          <p className="mt-2 text-sm text-gray-500">
            Enjoy quality food at 40-60% off regular prices while helping reduce
            food waste.
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Bell className="text-orange-600" />
          </div>
          <h3 className="text-lg font-medium">Get Notified</h3>
          <p className="mt-2 text-sm text-gray-500">
            Enable notifications to be the first to know when your favorite
            restaurants post surplus items.
          </p>
        </div>

        {/* <div className="rounded-lg bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"></path>
              <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1"></path>
              <path d="M12 8v13"></path>
              <path d="M12 5v-2"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium">Choose Eco Restaurants</h3>
          <p className="mt-2 text-sm text-gray-500">
            Support restaurants that have committed to sustainable practices and
            reducing food waste.
          </p>
        </div> */}
      </div>
    </section>
  );
};

export default Help;
