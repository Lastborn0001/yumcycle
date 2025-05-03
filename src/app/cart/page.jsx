"use client";
import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import { Button } from "@/components/ui/Buttons";
import { Textarea } from "@/components/ui/Textarea";
import {
  ChevronLeft,
  CreditCard,
  Leaf,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import React, { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import ClientLayout from "@/app/ClientLayout";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "@/libs/AuthContext";
import { useCartStore } from "@/store/cartStore";
import Loading from "@/components/ui/Loading";

const CartPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);

  const cartItems = useCartStore((state) => state.items);
  const cartStatus = useCartStore((state) => state.status);
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItemCount = useMemo(
    () => (Array.isArray(cartItems) ? cartItems.length : 0),
    [cartItems]
  );
  const initializeCart = useCartStore((state) => state.initializeCart);

  useEffect(() => {
    if (loading || hasRedirected.current || user !== null) {
      return;
    }

    if (user === null && !cartStatus.includes("loading")) {
      hasRedirected.current = true;
      toast.error("Please log in to view your cart");
      router.push("/login");
    }
    if (user && cartStatus === "idle") {
      initializeCart();
    }
  }, [user, loading, cartStatus, router]);

  const subtotal = useMemo(
    () =>
      cartItems && Array.isArray(cartItems)
        ? cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )
        : 0,
    [cartItems]
  );
  const deliveryFee = 30;
  const serviceFee = 40;
  const tax = 300;
  const tip = 400;
  const donation = 2;
  const total = subtotal + deliveryFee + serviceFee + tax + tip + donation;

  const handleIncrement = async (itemId) => {
    try {
      const result = await updateCartItem({ itemId, action: "increment" });
      if (!result.success) {
        throw new Error(result.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Increment error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDecrement = async (itemId) => {
    try {
      const result = await updateCartItem({ itemId, action: "decrement" });
      if (!result.success) {
        throw new Error(result.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Decrement error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const result = await updateCartItem({ itemId, action: "remove" });
      if (!result.success) {
        throw new Error(result.error || "Failed to remove item");
      }
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleClearCart = async () => {
    try {
      const result = await clearCart();
      if (!result.success) {
        throw new Error(result.error || "Failed to clear cart");
      }
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Clear cart error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  if (cartStatus === "loading") {
    return <Loading />;
  }

  return (
    <ClientLayout>
      <Nav />
      <main className="lg:w-[80%] h-dvh p-5 w-full m-auto">
        <Toaster position="top-center" />
        <section>
          <div className="py-24 md:py-24">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold">Your Cart</h1>
              <p
                className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-orange-500 cursor-pointer"
                onClick={() => router.push("/restaurants")}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </p>
            </div>

            {cartItemCount === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-muted-foreground">
                  Browse our restaurants and add some delicious food to your
                  cart.
                </p>
                <Button
                  className="mt-6"
                  onClick={() => router.push("/restaurants")}
                >
                  Browse Restaurants
                </Button>
              </div>
            ) : (
              <div className="grid gap-8 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <div className="rounded-lg border border-gray-300 p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                      Cart Items ({cartItemCount})
                    </h2>
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item._id}>
                          <div className="flex gap-4">
                            <img
                              src={item.image || "/placeholder-food.jpg"}
                              alt={item.name}
                              className="h-20 w-20 rounded-md object-cover"
                            />
                            <div className="flex flex-1 flex-col">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-gray-500">
                                    From {item.restaurantName || "Restaurant"}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  ₦{item.price * item.quantity}
                                </p>
                              </div>
                              <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 transition hover:bg-green-300 cursor-pointer border-gray-300 hover:text-white"
                                    onClick={() => handleIncrement(item._id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 transition hover:bg-green-300 cursor-pointer border-gray-300 hover:text-white"
                                    onClick={() => handleDecrement(item._id)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-gray-500 hover:text-red-500 cursor-pointer"
                                  onClick={() => handleRemove(item._id)}
                                >
                                  <Trash2 className="mr-1 h-4 w-4" />
                                  <span>Remove</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                          <hr className="mt-4 border-gray-300" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <h3 className="mb-2 text-sm font-medium">
                        Special Instructions
                      </h3>
                      <Textarea
                        placeholder="Add any special instructions for your order..."
                        className="resize-none border-gray-300 ring-orange-300"
                      />
                    </div>
                    <Button
                      className="mt-4 bg-red-500 text-white hover:bg-red-600"
                      onClick={handleClearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                  <div className="mt-6 rounded-lg border border-gray-300 bg-green-50 p-6">
                    <div className="flex items-start gap-3">
                      <Leaf className="mt-1 h-5 w-5 text-food-green" />
                      <div>
                        <h3 className="font-medium text-food-green">
                          Fight Food Waste
                        </h3>
                        <p className="mt-1 text-sm">
                          Add ₦100 to your order to donate a meal to someone in
                          need. We partner with local food banks to distribute
                          meals to those facing food insecurity.
                        </p>
                        <div className="mt-3 flex items-center space-x-2">
                          <input type="checkbox" id="donate-meal" />
                          <label
                            htmlFor="donate-meal"
                            className="text-sm font-medium leading-none"
                          >
                            Yes, I'd like to donate a meal (+₦100)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="sticky top-20 rounded-lg border border-gray-300 p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                      Order Summary
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₦{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Delivery Fee
                        </span>
                        <span>₦{deliveryFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Service Fee
                        </span>
                        <span>₦{serviceFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>₦{tax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tip</span>
                        <span>₦{tip}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Meal Donation
                        </span>
                        <span>₦{donation}</span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₦{total}</span>
                      </div>
                    </div>
                    <Button
                      className="mt-6 w-full gap-2 bg-orange-500 text-white cursor-pointer hover:bg-orange-400"
                      size="lg"
                      onClick={() => router.push("/checkout")}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Proceed to Checkout</span>
                    </Button>
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      By proceeding, you agree to our Terms of Service and
                      Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </ClientLayout>
  );
};

export default CartPage;
