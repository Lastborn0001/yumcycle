"use client";
import { MapPin, ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "@/libs/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { auth } from "@/libs/firebaseClient";
import Button from "@/components/ui/Button";

const FoodWasteMatter = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  // Cart store
  const addToCart = useCartStore((state) => state.addToCart);

  // Fetch surplus menu items
  useEffect(() => {
    const fetchSurplusItems = async () => {
      try {
        setLoading(true);
        // Fetch surplus items (no restaurantId, no auth required)
        const response = await fetch("/api/restaurants/menu");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load surplus items");
        }
        const data = await response.json();
        console.log("Fetched surplus items:", data); // Debug log
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurplusItems();
  }, []);

  // Add to cart handler
  const handleAddToCart = async (item) => {
    try {
      // 1. Authentication check
      if (!user) {
        toast.error("Please log in to add items to cart");
        return router.push(`/login?redirect=/food-waste-matter`);
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
        currentCart[0].restaurantId !== item.restaurant.toString()
      ) {
        return toast.error(
          `Your cart contains items from ${currentCart[0].restaurantName}. ` +
            `Please clear your cart or checkout before ordering from another restaurant.`
        );
      }

      // 4. Prepare item data with surplus price
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

      // 5. Add to cart
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

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <section className="p-[40px] lg:p-[10px_10px]">
        <Toaster position="top-center" />
        <h2 className="text-[20px] font-bold p-1">Available Surplus Items</h2>
        <p className="text-[15px] text-gray-500">
          {menuItems.length} items available
        </p>
      </section>
      <section className="py-8 px-4">
        {menuItems.length === 0 ? (
          <div className="text-center py-8">
            <p>No surplus items available</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg hover:rounded-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder-food.jpg"}
                    className="w-full h-[150px] object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={item.name}
                  />
                </div>
                <div className="p-4 border-2 border-t-0 border-gray-100 group-hover:border-orange-200 transition-colors duration-300">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div>
                    <p className="flex items-center gap-1 text-gray-400">
                      <MapPin className="w-[15px] h-[15px]" />{" "}
                      {item.restaurantName || "Unknown Restaurant"}
                    </p>
                    <p className="flex items-center gap-2 text-green-700 font-bold">
                      ₦{item.surplusPrice.toFixed(2)}
                      <span className="text-gray-400 line-through">
                        ₦{(item.originalPrice ?? item.price ?? 0).toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <Button
                    className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors duration-300"
                    name="Add to Cart"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="w-4 h-4 inline-block mr-2" />
                    Add to cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default FoodWasteMatter;
