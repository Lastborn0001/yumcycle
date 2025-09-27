"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "@/libs/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { auth } from "@/libs/firebaseClient";
import { motion } from "framer-motion";
import FoodWasteHero from "./FoodWasteHero";
import SurplusFilters from "./SurplusFilters";
import SurplusItemCard from "./SurplusItemCard";
import SurplusStats from "./SurplusStats";
// import EmptySurplusState from "./EmptySurplusState";
import NotificationSettings from "./NotificationSettings";

const ModernFoodWastePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    restaurant: "all",
    category: "all",
    priceRange: "all",
    sortBy: "discount",
  });
  const router = useRouter();
  const { user } = useAuth();

  // Cart store
  const addToCart = useCartStore((state) => state.addToCart);

  // Fetch surplus menu items
  useEffect(() => {
    const fetchSurplusItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/restaurants/menu");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load surplus items");
        }
        const data = await response.json();
        setMenuItems(data);
        setFilteredItems(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurplusItems();
  }, []);

  // Filter and sort items
  useEffect(() => {
    let filtered = [...menuItems];

    // Restaurant filter
    if (filters.restaurant !== "all") {
      filtered = filtered.filter(
        (item) => item.restaurantName === filters.restaurant
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((item) => {
        const price = item.surplusPrice || item.price;
        return price >= min && (max ? price <= max : true);
      });
    }

    // Sort items
    switch (filters.sortBy) {
      case "discount":
        filtered.sort((a, b) => {
          const discountA =
            ((a.originalPrice - a.surplusPrice) / a.originalPrice) * 100;
          const discountB =
            ((b.originalPrice - b.surplusPrice) / b.originalPrice) * 100;
          return discountB - discountA;
        });
        break;
      case "price-low":
        filtered.sort(
          (a, b) => (a.surplusPrice || a.price) - (b.surplusPrice || b.price)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => (b.surplusPrice || b.price) - (a.surplusPrice || a.price)
        );
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredItems(filtered);
  }, [menuItems, filters]);

  // Add to cart handler
  const handleAddToCart = async (item) => {
    try {
      if (!user) {
        toast.error("Please log in to add items to cart");
        return router.push(`/login?redirect=/food-waste-matter`);
      }

      let userToken;
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("No authenticated user found");
        }
        userToken = await currentUser.getIdToken();
        if (!userToken) {
          throw new Error("Failed to get authentication token");
        }
      } catch (tokenError) {
        console.error("Token error:", tokenError);
        throw new Error("Authentication failed. Please try again.");
      }

      const currentCart = useCartStore.getState().items;
      if (
        Array.isArray(currentCart) &&
        currentCart.length > 0 &&
        currentCart[0].restaurantId !== item.restaurant.toString()
      ) {
        return toast.error(
          `Your cart contains items from ${currentCart[0].restaurantName}. ` +
            `Please clear your cart or checkout before ordering from another restaurant.`
        );
      }

      const itemToAdd = {
        _id: item._id,
        name: item.name,
        price: item.surplusPrice,
        restaurantId: item.restaurant.toString(),
        restaurantName: item.restaurantName || "Unknown Restaurant",
        image: item.image || "/placeholder-food.jpg",
        category: item.category || "general",
        description: item.description || "",
        isSurplus: true,
      };

      const result = await addToCart(itemToAdd, userToken);

      if (!result.success) {
        throw new Error(result.error || "Failed to update cart");
      }

      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error("Cart operation failed:", error);
      toast.error(error.message || "Failed to update cart");
    }
  };

  // Calculate surplus statistics
  const surplusStats = {
    totalItems: menuItems.length,
    totalSavings: menuItems.reduce(
      (sum, item) => sum + (item.originalPrice - item.surplusPrice),
      0
    ),
    avgDiscount:
      menuItems.length > 0
        ? menuItems.reduce((sum, item) => {
            const discount =
              ((item.originalPrice - item.surplusPrice) / item.originalPrice) *
              100;
            return sum + discount;
          }, 0) / menuItems.length
        : 0,
    restaurants: new Set(menuItems.map((item) => item.restaurantName)).size,
  };

  // Get unique values for filters
  const uniqueRestaurants = [
    ...new Set(menuItems.map((item) => item.restaurantName)),
  ];
  const uniqueCategories = [...new Set(menuItems.map((item) => item.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Surplus Items
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl cursor-pointer hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 ">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <FoodWasteHero />

        {/* Notification Settings */}
        <div className="mb-8">
          <NotificationSettings />
        </div>

        {/* Surplus Stats */}
        <div className="mb-8">
          <SurplusStats stats={surplusStats} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <SurplusFilters
            filters={filters}
            onFiltersChange={setFilters}
            restaurants={uniqueRestaurants}
            categories={uniqueCategories}
            resultCount={filteredItems.length}
          />
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <EmptySurplusState
            hasItems={menuItems.length > 0}
            onClearFilters={() =>
              setFilters({
                restaurant: "all",
                category: "all",
                priceRange: "all",
                sortBy: "discount",
              })
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 "
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <SurplusItemCard
                  item={item}
                  onAddToCart={() => handleAddToCart(item)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModernFoodWastePage;
