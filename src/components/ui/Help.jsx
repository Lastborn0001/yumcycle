import { BadgeDollarSign } from "lucide-react";
import React from "react";

const Help = () => {
  return (
    <section className="mt-16 mb-16 rounded-xl bg-gray-100 p-8">
      <h2 className="mb-6 text-center text-2xl font-semibold">
        How You Can Help
      </h2>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg bg-white p-5 text-center shadow-sm">
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
              className="text-orange-600"
            >
              <path d="M9 8h10"></path>
              <path d="M9 12h5"></path>
              <path d="M14 17H9"></path>
              <path d="M5 8h0"></path>
              <path d="M5 12h0"></path>
              <path d="M5 17h0"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium">Order Mindfully</h3>
          <p className="mt-2 text-sm text-gray-500">
            Order only what you need and will consume to avoid personal food
            waste.
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <BadgeDollarSign className="text-orange-600" />
          </div>
          <h3 className="text-lg font-medium">Support Discounted Items</h3>
          <p className="mt-2 text-sm text-gray-500">
            Purchase food items that are near their best-by date but still
            perfectly good to eat.
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 text-center shadow-sm">
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
              <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium">Donate a Meal</h3>
          <p className="mt-2 text-sm text-gray-500">
            Add a small donation to your order to help provide meals to those in
            need.
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 text-center shadow-sm">
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
        </div>
      </div>
    </section>
  );
};

export default Help;
