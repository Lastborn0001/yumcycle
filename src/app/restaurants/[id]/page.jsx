"use client";
import { Clock, Map, Truck, Leaf, ShoppingCart } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ClientLayout from "@/app/ClientLayout";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "@/libs/AuthContext";
import { useCartStore } from "@/store/cartStore";
import useAuthCart from "@/hooks/useAuthCart";
import { auth } from "@/libs/firebaseClient";
import Chatbot from "@/components/Chatbot";
import Loading from "@/components/ui/Loading";

const RestaurantPage = () => {
  const params = useParams();
  const id = params.id;
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  useEffect(() => {
    if (!id) return;

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
        // Get the current user from Firebase auth
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

      // 4. Prepare complete item data
      const itemToAdd = {
        _id: item._id,
        name: item.name,
        price: item.price,
        restaurantId: id,
        restaurantName: restaurant?.name,
        image: item.image || "/placeholder-food.jpg",
        category: item.category || "general",
        description: item.description || "",
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
  if (loading || cartStatus === "loading") return <Loading />;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!restaurant)
    return <div className="text-center py-8">Restaurant not found</div>;

  return (
    <ClientLayout>
      <Nav />
      <main className="h-dvh">
        <section className="mb-8 xl:w-[80%] p-9 w-full m-auto relative py-12 md:py-24">
          <Toaster position="top-center" />
          <div className="relative">
            <img
              src={restaurant.image || "/placeholder-restaurant.jpg"}
              alt={restaurant.name}
              className="h-64 w-full object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <div className="mt-1 flex flex-wrap gap-1">
                {restaurant.cuisine.map((type, index) => (
                  <span key={index} className="text-sm">
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
          <div className="mt-4 flex items-center justify-between">
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
        </section>

        <section className="mb-8 xl:w-[80%] p-9 w-full m-auto">
          <h2 className="mb-4 text-xl font-semibold">Menu</h2>
          {menuItems.length === 0 ? (
            <div className="text-center py-8">
              <p>No menu items available</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  className="group w-full max-w-[400px] mx-auto overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
                >
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder-food.jpg"}
                      alt={item.name}
                      className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <h3 className="truncate text-lg font-bold">
                        {item.name}
                      </h3>
                      <p className="text-sm truncate">{item.description}</p>
                    </div>
                    <span className="absolute left-2 top-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        ₦{item.price}
                      </span>
                      <Button
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                        name="Add to Cart"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {cartItemCount > 0 && (
          <section className="mb-8 xl:w-[80%] p-9 w-full m-auto">
            <h2 className="mb-4 text-xl font-semibold">
              Cart ({cartItemCount} items)
            </h2>
            <div className="rounded-lg shadow-md p-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between py-2">
                  <span>{item.name}</span>
                  <span>₦{item.price}</span>
                </div>
              ))}
              <div className="mt-4 flex justify-end">
                <Button
                  className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                  name="View Cart"
                  onClick={() => router.push("/cart")}
                >
                  View Cart
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Chatbot />
      <Footer />
    </ClientLayout>
  );
};

export default RestaurantPage;
