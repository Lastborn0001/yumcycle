"use client";
import {
  Clock,
  MapPin,
  Truck,
  Star,
  Leaf,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PopularRestaurants = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/restaurants");

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }

        const data = await response.json();

        // Sort by rating and get top 4
        const topRestaurants = data
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);

        setRestaurants(topRestaurants);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    router.push(`/restaurants/${restaurantId}`);
  };

  if (loading) {
    return (
      <section className="xl:w-[80%] w-full m-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Popular Restaurants
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Loading top-rated restaurants...
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-2xl"></div>
              <div className="bg-white p-4 rounded-b-2xl border border-gray-100">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="xl:w-[80%] w-full m-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600">
            Failed to load restaurants. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  if (restaurants.length === 0) {
    return (
      <section className="xl:w-[80%] w-full m-auto py-12 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
          <p className="text-gray-600">
            No restaurants available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="xl:w-[80%] w-full m-auto py-12 px-4">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-between items-center mb-10"
      >
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Popular Restaurants
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Our top-rated restaurants with the best food and service
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/restaurants")}
          className="hidden md:flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          <span>View All</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* Restaurant Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            onClick={() => handleRestaurantClick(restaurant._id)}
            className="group cursor-pointer w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white border border-gray-100"
          >
            {/* Restaurant Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={
                  restaurant.image ||
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
                }
                alt={restaurant.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold truncate mb-1">
                    {restaurant.name}
                  </h3>
                  {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-xs">
                      {restaurant.cuisine.slice(0, 2).map((type, idx) => (
                        <span key={idx} className="text-white/90">
                          {type}
                          {idx < Math.min(restaurant.cuisine.length - 1, 1) &&
                            " • "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {restaurant.isEcoFriendly && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium shadow-lg">
                    <Leaf className="h-3 w-3" />
                    <span>Eco-Friendly</span>
                  </div>
                )}
                {restaurant.rating >= 4.5 && (
                  <div className="px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white rounded-full text-xs font-bold shadow-lg">
                    Top Rated
                  </div>
                )}
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-4">
              {/* Rating and Min Order */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-800">
                    {restaurant.rating ? restaurant.rating.toFixed(1) : "4.5"}
                  </span>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  Min. ₦{restaurant.minOrder || 100}
                </span>
              </div>

              {/* Details */}
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium">
                    {restaurant.deliveryTime || "25-35 min"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-green-500" />
                  <span className="font-medium">
                    ₦{restaurant.deliveryFee || 200}
                  </span>
                </div>
                {restaurant.distance && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-red-500" />
                    <span className="font-medium">{restaurant.distance}</span>
                  </div>
                )}
              </div>

              {/* Location (if no distance) */}
              {!restaurant.distance && restaurant.location && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{restaurant.location}</span>
                </div>
              )}
            </div>

            {/* Hover Effect Indicator */}
            <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </motion.div>
        ))}
      </div>

      {/* Mobile View All Button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/restaurants")}
        className="md:hidden w-full mt-8 flex items-center justify-center space-x-2 px-6 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-lg"
      >
        <span>View All Restaurants</span>
        <ArrowRight className="h-5 w-5" />
      </motion.button>
    </section>
  );
};

export default PopularRestaurants;
