"use client";
import { Clock, Map, Truck, Leaf, ShoppingCart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const RestaurantPage = () => {
  const params = useParams();
  const id = params.id;
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch restaurant
        const restaurantResponse = await fetch(`/api/restaurants/${id}`);
        if (!restaurantResponse.ok) {
          const errorData = await restaurantResponse.json();
          throw new Error(errorData.error || "Restaurant not found");
        }
        const restaurantData = await restaurantResponse.json();
        setRestaurant(restaurantData);

        // Fetch menu items
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    alert(`${item.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!restaurant)
    return <div className="text-center py-8">Restaurant not found</div>;

  return (
    <>
      <Nav />
      <section className="mb-8 xl:w-[80%] p-9 w-full m-auto relative py-12 md:py-24">
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
                    <h3 className="truncate text-lg font-bold">{item.name}</h3>
                    <p className="text-sm truncate">{item.description}</p>
                  </div>
                  <span className="absolute left-2 top-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">₦{item.price}</span>
                    <Button
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                      name="Add to Cart"
                      onClick={() => addToCart(item)}
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

      {cart.length > 0 && (
        <section className="mb-8 xl:w-[80%] p-9 w-full m-auto">
          <h2 className="mb-4 text-xl font-semibold">
            Cart ({cart.length} items)
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
                onClick={() => alert("Proceed to checkout (not implemented)")}
              />
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

export default RestaurantPage;
