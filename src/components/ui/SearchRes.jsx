"use client";
import { Clock, Map, Search, Truck, Leaf } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";

const SearchRes = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/restaurants");
        if (!response.ok) {
          throw new Error("Failed to load restaurants");
        }
        const data = await response.json();
        // Filter approved restaurants
        const approvedRestaurants = data.filter(
          (restaurant) => restaurant.status === "approved"
        );
        setRestaurants(approvedRestaurants);
        setFilteredRestaurants(approvedRestaurants);
      } catch (err) {
        setError("Failed to load restaurants");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.some((c) =>
          c.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesCuisine = cuisineFilter
        ? restaurant.cuisine.includes(cuisineFilter)
        : true;
      return matchesSearch && matchesCuisine;
    });
    setFilteredRestaurants(filtered);
  }, [searchTerm, cuisineFilter, restaurants]);

  const cuisines = [...new Set(restaurants.flatMap((r) => r.cuisine))];

  if (loading)
    return <div className="text-center py-8">Loading restaurants...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <>
      <section className="mb-8 xl:w-[80%] p-9 w-full m-auto">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <form className="flex w-full gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="search"
                  placeholder="Search for restaurants or cuisines..."
                  className="pl-10 pr-4 text-black flex h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 ring-offset-background placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="h-12 rounded-md border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
              >
                <option value="">All Cuisines</option>
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
              <Button
                className="h-12 px-4 py-2 rounded-md cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                name={"Search"}
              />
            </form>
          </div>
        </div>
      </section>

      <section className="mb-8 xl:w-[80%] p-9 w-full m-auto">
        <h2 className="mb-4 text-xl font-semibold">
          {filteredRestaurants.length} Restaurants Found
        </h2>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-8">
            <p>No restaurants match your search criteria</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCuisineFilter("");
              }}
              className="mt-2 text-orange-500 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl cursor-pointer"
                onClick={() => router.push(`/restaurants/${restaurant._id}`)}
              >
                <div className="relative">
                  <img
                    src={restaurant.image || "/placeholder-restaurant.jpg"}
                    alt={restaurant.name}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h3 className="truncate text-lg font-bold">
                      {restaurant.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {restaurant.cuisine.map((type, index) => (
                        <span key={index} className="text-xs">
                          {type}
                          {index < restaurant.cuisine.length - 1 ? " • " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                  {restaurant.isEcoFriendly && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      <Leaf className="h-3 w-3" /> Eco-Friendly
                    </div>
                  )}
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
                        {restaurant.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Min. ₦{restaurant.minOrder}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      <span>₦{restaurant.deliveryFee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      <span>{restaurant.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default SearchRes;
