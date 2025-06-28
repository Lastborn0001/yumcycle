import React from "react";

const HowItWork = () => {
  return (
    <section className="bg-gray-100 py-16 mt-[70px]">
      <div className="container m-auto">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Order your favorite food while making a positive impact on the
            environment
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-orange-500"
              >
                <path d="M3 15v2a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-2"></path>
                <path d="M16 4c0-1.1.9-2 2-2"></path>
                <path d="M12 4c0-1.1.9-2 2-2"></path>
                <path d="M8 4c0-1.1.9-2 2-2"></path>
                <path d="m2 8 4 2 4-2 4 2 4-2 4 2"></path>
                <path d="M12 12v8"></path>
                <path d="M8 12v8"></path>
                <path d="M16 12v8"></path>
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold">Find Restaurants</h3>
            <p className="mt-2 text-gray-500">
              Browse our selection of restaurants and discover surplus food
              deals
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
                <line x1="6" x2="18" y1="17" y2="17"></line>
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold">Place Your Order</h3>
            <p className="mt-2 text-gray-500">
              Select your meals from regular menu or surplus items at discounted
              prices
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m4.9 4.9 14.2 14.2"></path>
                <path d="M12 18.8c-3.8 0-6.8-3-6.8-6.8 0-2 .8-3.7 2.2-5"></path>
                <path d="M14 7.5c1 .8 1.8 1.9 2.3 3.1"></path>
                <path d="M17.7 15.2c-.7.9-1.6 1.7-2.7 2.2"></path>
                <path d="M8.3 13.8c.5 1.3 1.4 2.4 2.7 3"></path>
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold">Enjoy & Save</h3>
            <p className="mt-2 text-gray-500">
              Receive your food and feel good about saving money while reducing
              waste
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
