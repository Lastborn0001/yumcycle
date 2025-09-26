"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "@/libs/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { auth } from "@/libs/firebaseClient";
import { motion } from "framer-motion";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ClientLayout from "@/app/ClientLayout";
import Chatbot from "@/components/Chatbot";
import Loading from "@/components/ui/Loading";
import RestaurantHero from "./RestaurantHero";
import RestaurantInfo from "./RestaurantInfo";
import MenuSection from "./MenuSection";
import CartPreview from "./CartPreview";
import RestaurantStats from "./RestaurantStats";

const ModernRestaurantPage = () => {
  const params = useParams();
  const id = params.id;
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();
  const { user } = useAuth();

  // Memoized cart selectors
  const cart = useCartStore((state) => state.items);
  const cartStatus = useCartStore((state) => state.status);
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItemCount = useMemo(
    () => (Array.isArray(cart) ? cart.length : 0),
    [cart]
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const restaurantResponse = await fetch(`/api/restaurants/${id}`);
      if (!restaurantResponse.ok) {
        const errorData = await restaurantResponse.json();
        throw new Error(errorData.error || "Restaurant not found");
      }
      const restaurantData = await restaurantResponse.json();
      setRestaurant(restaurantData);

      const menuResponse = await fetch(
        `/api/restaurants/menu?restaurantId=${id}`
      );
      if (!menuResponse.ok) {
        const errorData = await menuResponse.json();
        throw new Error(errorData.error || "Failed to load menu items");
      }
      const menuData = await menuResponse.json();
      setMenuItems(menuData);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const handleAddToCart = async (item) => {
    try {
      // 1. Authentication check
      if (!user) {
        toast.error("Please log in to add items to cart");
        return router.push(`/login?redirect=/restaurants/${id}`);
      }

      // 2. Get the Firebase user token
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

      // 3. Restaurant consistency check
      const currentCart = useCartStore.getState().items;
      if (
        Array.isArray(currentCart) &&
        currentCart.length > 0 &&
        currentCart[0].restaurantId !== id
      ) {
        return toast.error(
          `Your cart contains items from ${currentCart[0].restaurantName}. ` +
            `Please clear your cart or checkout before ordering from another restaurant.`
        );
      }

      // 4. Prepare complete item data with correct price
      const effectivePrice =
        item.isSurplus && item.surplusPrice
          ? item.surplusPrice
          : item.originalPrice ?? item.price ?? 0;
      const itemToAdd = {
        _id: item._id,
        name: item.name,
        price: effectivePrice,
        restaurantId: id,
        restaurantName: restaurant?.name,
        image: item.image || "/placeholder-food.jpg",
        category: item.category || "general",
        description: item.description || "",
        isSurplus: item.isSurplus || false,
      };

      // 5. Add to cart with the token
      const result = await addToCart(itemToAdd, userToken);

      if (!result.success) {
        throw new Error(result.error || "Failed to update cart");
      }

      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error("Cart operation failed:", {
        error,
        time: new Date().toISOString(),
      });
      toast.error(error.message || "Failed to update cart");
    }
  };

  // Get unique categories from menu items
  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((item) => item.category || "Other"));
    return ["all", ...Array.from(cats)];
  }, [menuItems]);

  // Filter menu items by selected category
  const filteredMenuItems = useMemo(() => {
    if (selectedCategory === "all") return menuItems;
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  // Calculate restaurant stats
  const restaurantStats = useMemo(() => {
    const totalItems = menuItems.length;
    const surplusItems = menuItems.filter((item) => item.isSurplus).length;
    const avgPrice =
      menuItems.length > 0
        ? menuItems.reduce((sum, item) => {
            const price =
              item.isSurplus && item.surplusPrice
                ? item.surplusPrice
                : item.originalPrice ?? item.price ?? 0;
            return sum + price;
          }, 0) / menuItems.length
        : 0;

    return {
      totalItems,
      surplusItems,
      avgPrice,
      categories: categories.length - 1, // Exclude 'all'
    };
  }, [menuItems, categories]);

  if (loading || cartStatus === "loading") {
    return (
      <ClientLayout>
        <Nav />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Loading />
          </div>
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <Nav />
        <main className="min-h-screen bg-gradient-to-br pt-20 from-gray-50 to-white">
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
                Restaurant Not Available
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => router.push("/restaurants")}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Browse Other Restaurants
              </button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  if (!restaurant) {
    return (
      <ClientLayout>
        <Nav />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🏪</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Restaurant Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The restaurant you're looking for doesn't exist or has been
                removed.
              </p>
              <button
                onClick={() => router.push("/restaurants")}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                Browse Restaurants
              </button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Nav />
      <Toaster position="top-center" />

      <main className="min-h-screen bg-gradient-to-br pt-20 from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Restaurant Hero Section */}
          <RestaurantHero restaurant={restaurant} />

          {/* Restaurant Info & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <RestaurantInfo restaurant={restaurant} />
            </div>
            <div>
              <RestaurantStats stats={restaurantStats} />
            </div>
          </div>

          {/* Menu Section */}
          <MenuSection
            menuItems={filteredMenuItems}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddToCart={handleAddToCart}
            restaurantName={restaurant.name}
          />

          {/* Cart Preview */}
          {cartItemCount > 0 && (
            <CartPreview
              cart={cart}
              itemCount={cartItemCount}
              onViewCart={() => router.push("/cart")}
            />
          )}
        </div>
      </main>

      <Chatbot />
      <Footer />
    </ClientLayout>
  );
};

export default ModernRestaurantPage;
