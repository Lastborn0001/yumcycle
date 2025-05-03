"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/libs/AuthContext";
import ClientLayout from "@/app/ClientLayout";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { Toaster, toast } from "react-hot-toast";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Chatbot from "@/components/Chatbot";
import Loading from "@/components/ui/Loading";

const OrderHistoryPage = () => {
  const router = useRouter();
  const { firebaseUser, loading } = useAuth();
  const hasRedirected = useRef(false);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("OrderHistoryPage auth state:", { firebaseUser, loading });
    if (loading || hasRedirected.current) return;

    // Debounce redirect to ensure auth state is stable
    const redirectTimeout = setTimeout(() => {
      if (!loading && firebaseUser === null) {
        // console.log("No user detected, redirecting to /login");
        hasRedirected.current = true;
        toast.error("Please log in to view your orders");
        router.push("/login");
      }
    }, 500);

    return () => clearTimeout(redirectTimeout);
  }, [firebaseUser, loading, router]);

  useEffect(() => {
    if (loading || !firebaseUser) return;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // console.log("Fetching orders for user:", {
        //   uid: firebaseUser.uid,
        //   email: firebaseUser.email,
        // });
        const token = await firebaseUser.getIdToken();
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch orders");
        }

        const data = await response.json();
        // console.log("Fetched orders:", data.orders);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [firebaseUser, loading]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading || isLoading) {
    return (
      <ClientLayout>
        <Nav />
        <main className="lg:w-[80%] p-5 w-full m-auto">
          <Loading />
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <Nav />
        <main className="lg:w-[80%] h-dvh p-5 w-full m-auto">
          <div className="py-12 text-center text-red-500">{error}</div>
        </main>
        <Footer />
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Nav />
      <main className="lg:w-[80%] h-dvh p-5 w-full m-auto">
        <Toaster position="top-center" />
        <section>
          <div className="py-24 md:py-24">
            <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
            {orders.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold">No orders yet</h2>
                <p className="text-muted-foreground">
                  Browse restaurants and place an order to get started.
                </p>
                <button
                  className="mt-6 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  onClick={() => router.push("/restaurants")}
                >
                  Browse Restaurants
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-lg border border-gray-300 p-6 bg-white"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Restaurant: {order.items[0]?.restaurantName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Phone: {order.phoneNumber || "Not provided"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Address: {order.address || "Not provided"}
                    </p>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₦{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Chatbot />
      <Footer />
    </ClientLayout>
  );
};

export default OrderHistoryPage;
