"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/libs/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Buttons";
import { Toaster, toast } from "react-hot-toast";
import ClientLayout from "@/app/ClientLayout";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { CreditCard } from "lucide-react";

const CheckoutPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);
  const { items, status, initializeCart, clearCart } = useCartStore();
  const [email, setEmail] = useState(user?.email || "");
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Ensure Paystack script is loaded
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      console.log("Paystack script loaded");
      setPaystackLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Paystack script");
      toast.error("Failed to load payment system");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 30;
  const serviceFee = 40;
  const tax = 300;
  const tip = 400;
  const donation = 2;
  const total = subtotal + deliveryFee + serviceFee + tax + tip + donation;

  useEffect(() => {
    if (loading || hasRedirected.current || user !== null) return;

    if (user === null && !status.includes("loading")) {
      hasRedirected.current = true;
      toast.error("Please log in to checkout");
      router.push("/login");
    }
    if (user && status === "idle") {
      initializeCart();
    }
  }, [user, loading, status, router, initializeCart]);

  const getUserToken = async () => {
    const { getAuth } = await import("firebase/auth");
    const auth = getAuth();
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  };

  const verifyPayment = async (reference) => {
    try {
      const token = await getUserToken();
      if (!token) throw new Error("User not authenticated");

      const verifyResponse = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || "Failed to verify payment");
      }

      await clearCart();
      toast.dismiss();
      toast.success("Payment successful! Order placed.");
      router.push("/orders");
    } catch (error) {
      toast.dismiss();
      toast.error(`Payment verification failed: ${error.message}`);
    }
  };

  const handlePaystackPayment = () => {
    if (!paystackLoaded || !window.PaystackPop) {
      console.error("Paystack not loaded");
      toast.error("Payment system not loaded. Please try again.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      console.error("Paystack public key missing");
      toast.error("Payment configuration error");
      return;
    }

    try {
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: email || user?.email || "customer@example.com",
        amount: total * 100, // Convert to kobo
        currency: "NGN",
        callback: (response) => {
          console.log("Paystack callback response:", response);
          toast.loading("Verifying payment...");
          verifyPayment(response.reference); // Call verification separately
        },
        onClose: () => {
          console.log("Paystack payment closed");
          toast.error("Payment cancelled");
        },
        channels: ["card", "bank_transfer", "ussd", "mobile_money"],
      });

      console.log("Opening Paystack payment iframe");
      handler.openIframe();
    } catch (error) {
      console.error("Paystack setup error:", error);
      toast.error("Failed to initiate payment");
    }
  };

  if (status === "loading") {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <ClientLayout>
        <Nav />
        <main className="lg:w-[80%] p-5 w-full m-auto">
          <div className="py-12 text-center">
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <Button
              className="mt-6"
              onClick={() => router.push("/restaurants")}
            >
              Browse Restaurants
            </Button>
          </div>
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Nav />
      <main className="lg:w-[80%] p-5 w-full m-auto">
        <Toaster position="top-center" />
        <section>
          <div className="py-12 md:py-24">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid gap-8 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="rounded-lg border border-gray-300 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Order Details</h2>
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between mb-4">
                      <div>
                        <p className="font-medium">
                          {item.name} x {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          From {item.restaurantName}
                        </p>
                      </div>
                      <p>₦{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-20 rounded-lg border border-gray-300 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
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
                      <span className="text-muted-foreground">Service Fee</span>
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
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <Button
                    className="mt-6 w-full bg-orange-500 text-white hover:bg-orange-400"
                    onClick={handlePaystackPayment}
                    disabled={!paystackLoaded}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ₦{total}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ClientLayout>
  );
};

export default CheckoutPage;
