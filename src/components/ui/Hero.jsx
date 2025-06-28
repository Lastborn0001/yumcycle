import { Search } from "lucide-react";
import React from "react";
import Button from "./Button";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-orange-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mt-[50px]">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
            Delicious Food, <span className="text-orange-500">Delivered</span>{" "}
            with Purpose
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-500 md:text-xl">
            Order from your favorite restaurants and discover surplus food at
            great prices
          </p>

          <div className="relative mt-8 w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="search"
              placeholder="Search for restaurants or food..."
              className="pl-10 pr-4 text-black flex h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-orange-600"
            />
            <Button
              className="absolute rounded-sm cursor-pointer bg-orange-500 text-white right-1 top-1/2 px-4 py-2 -translate-y-1/2 h-10"
              name={"Search"}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">Popular searches:</span>
            {/* <Link
            to="/restaurants?q=pizza"
            className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Pizza
          </Link>
          <Link
            to="/restaurants?q=burger"
            className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Burgers
          </Link>
          <Link
            to="/restaurants?q=sushi"
            className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Sushi
          </Link>
          <Link
            to="/restaurants?q=healthy"
            className="rounded-full bg-white/10 px-3 py-1 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Healthy
          </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
