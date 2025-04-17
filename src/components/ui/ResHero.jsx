import React from "react";

const ResHero = () => {
  return (
    <section className="relative py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mt-[40px]">
          {" "}
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Discover Restaurants
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Find your favorite restaurants and explore their menus. Order food
            for delivery or pickup.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResHero;
