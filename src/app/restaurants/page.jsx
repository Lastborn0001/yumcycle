import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import Button from "@/components/ui/Button";
import { Clock, FilterX, Map, Search, Truck, X } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="relative py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mt-[40px]">
              {" "}
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Discover Restaurants
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-gray-500">
                Find your favorite restaurants and explore their menus. Order
                food for delivery or pickup.
              </p>
            </div>
          </div>
        </section>
        {/* Search and Filter Section */}
        <section className="mb-8 xl:w-[80%] p-9 w-full m-auto">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search Form */}
            <div className="relative ">
              <form className="flex w-full">
                <div className="relative w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="search"
                    placeholder="Search for restaurants..."
                    className="pl-10 pr-4 text-black flex h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:ring-orange-600"
                  />
                </div>
                <Button
                  className="absolute rounded-sm cursor-pointer bg-orange-500 text-white right-1 top-1/2 px-4 py-2 -translate-y-1/2 h-10"
                  name={"Search"}
                />
              </form>
            </div>
          </div>
        </section>
        {/* Results Section */}
        <section className="mb-8 xl:w-[80%] p-9 w-full m-auto">
          <h2 className="mb-4 text-xl font-semibold">4 Restaurants Found</h2>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
            <div className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl">
              <div className="relative">
                <img
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ5z_h6uMLkVF_avhcU2W3lyuuq4Cgp4op1A&s"
                  }
                  alt={"chicken republic"}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="truncate text-lg font-bold">
                    {"chicken republic"}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    Nigeria • Jollof
                    {/* {restaurant.cuisine.map((type, index) => (
          <span key={index} className="text-xs">{type}{index < restaurant.cuisine.length - 1 ? ' • ' : ''}</span>
        ))} */}
                  </div>
                </div>
                {/* {restaurant.isEcoFriendly && (
      <Badge variant="secondary" className="absolute right-2 top-2">
        <Leaf className="mr-1 h-3 w-3" /> Eco-Friendly
      </Badge>
    )} */}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-500"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      4.7
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Min. ₦100
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>25-35 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>₦200</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Map className="h-4 w-4" />
                    <span>1.5 miles</span>
                  </div>
                </div>
              </div>
            </div>
            {/* card 2 */}
            <div className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl">
              <div className="relative">
                <img
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ5z_h6uMLkVF_avhcU2W3lyuuq4Cgp4op1A&s"
                  }
                  alt={"chicken republic"}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="truncate text-lg font-bold">
                    {"chicken republic"}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    Nigeria • Jollof
                    {/* {restaurant.cuisine.map((type, index) => (
          <span key={index} className="text-xs">{type}{index < restaurant.cuisine.length - 1 ? ' • ' : ''}</span>
        ))} */}
                  </div>
                </div>
                {/* {restaurant.isEcoFriendly && (
      <Badge variant="secondary" className="absolute right-2 top-2">
        <Leaf className="mr-1 h-3 w-3" /> Eco-Friendly
      </Badge>
    )} */}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-500"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      4.7
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Min. ₦100
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>25-35 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>₦200</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Map className="h-4 w-4" />
                    <span>1.5 miles</span>
                  </div>
                </div>
              </div>
            </div>
            {/* card 3 */}
            <div className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl">
              <div className="relative">
                <img
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ5z_h6uMLkVF_avhcU2W3lyuuq4Cgp4op1A&s"
                  }
                  alt={"chicken republic"}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="truncate text-lg font-bold">
                    {"chicken republic"}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    Nigeria • Jollof
                    {/* {restaurant.cuisine.map((type, index) => (
          <span key={index} className="text-xs">{type}{index < restaurant.cuisine.length - 1 ? ' • ' : ''}</span>
        ))} */}
                  </div>
                </div>
                {/* {restaurant.isEcoFriendly && (
      <Badge variant="secondary" className="absolute right-2 top-2">
        <Leaf className="mr-1 h-3 w-3" /> Eco-Friendly
      </Badge>
    )} */}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-500"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      4.7
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Min. ₦100
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>25-35 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>₦200</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Map className="h-4 w-4" />
                    <span>1.5 miles</span>
                  </div>
                </div>
              </div>
            </div>
            {/* card 4 */}
            <div className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl">
              <div className="relative">
                <img
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ5z_h6uMLkVF_avhcU2W3lyuuq4Cgp4op1A&s"
                  }
                  alt={"chicken republic"}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="truncate text-lg font-bold">
                    {"chicken republic"}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    Nigeria • Jollof
                    {/* {restaurant.cuisine.map((type, index) => (
          <span key={index} className="text-xs">{type}{index < restaurant.cuisine.length - 1 ? ' • ' : ''}</span>
        ))} */}
                  </div>
                </div>
                {/* {restaurant.isEcoFriendly && (
      <Badge variant="secondary" className="absolute right-2 top-2">
        <Leaf className="mr-1 h-3 w-3" /> Eco-Friendly
      </Badge>
    )} */}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-500"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      4.7
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Min. ₦100
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>25-35 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>₦200</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Map className="h-4 w-4" />
                    <span>1.5 miles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default page;
