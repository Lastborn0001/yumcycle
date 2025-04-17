import { Clock, Map, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PopularRestaurant = () => {
  const router = useRouter();
  return (
    <section className="xl:w-[80%] w-full m-auto ">
      <div className="flex justify-between p-10">
        <div>
          <h2 className="text-3xl font-bold">Popular Restaurants</h2>
          <p className="text-[13px]">
            Our top-rated restaurants with the best food and service
          </p>
        </div>
        <p
          onClick={() => {
            router.push("/restaurants");
          }}
          className="text-[13px] text-orange-500 cursor-pointer"
        >
          View All &gt;
        </p>
      </div>
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
              <span className="text-sm text-muted-foreground">Min. ₦100</span>
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
              <span className="text-sm text-muted-foreground">Min. ₦100</span>
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
              <span className="text-sm text-muted-foreground">Min. ₦100</span>
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
              <span className="text-sm text-muted-foreground">Min. ₦100</span>
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
  );
};

export default PopularRestaurant;
